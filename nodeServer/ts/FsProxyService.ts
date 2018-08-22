import { Response, Request } from "express";
import { Router } from "express-serve-static-core";
import {FTAMessageType, FTAMessage, FTAConnectionTarget, FTAConnectOptions, FTAError, FTASuccess, FTAPath, FTAFileInfo, FTAPayload, FTASide, FTAFolder, FTABinaryData, FTAFileMode} from "../../common/FTATypes";
import { FTAConnection, FTAConnectionEvents } from "./FTAConnection"
import { SFTPConnection } from "./SFTPConnection";
import { FTPConnection } from "./FTPConnection";
import * as fs from 'fs';
import * as path from 'path';
//import { LocalConnection } from "./LocalConnection";
import { ZssServerConnection } from "./ZssServerConnection";
//import { WebSocket } from '@types/websocket';


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

const express = require('express');
const expressWs = require('express-ws');
const bbPromise = require('bluebird');
const http = require('http');

class FTAWebsocketProxy {
  clientIP: string;
  clientPort: number;
  websocket: WebSocket;
  remoteConnection: FTAConnection;
  localConnection: FTAConnection;
  constructor(clientIP: string, clientPort: number, context: any, session: any, websocket: WebSocket) {
    this.clientIP = clientIP;
    this.clientPort = clientPort;
    websocket.onmessage = this.onmessage.bind(this);
    websocket.onclose = this.onclose.bind(this);
    websocket.onerror = this.onerror;
    this.websocket = websocket;
    //this.localConnection = new LocalConnection(FTASide.LOCAL);
    if (session["com.rs.auth.zssAuth"] && session["com.rs.auth.zssAuth"].authenticated) {
      this.localConnection = new ZssServerConnection(FTASide.LOCAL, context.plugin.server.config.startUp.proxiedHost, context.plugin.server.config.startUp.proxiedPort, session["com.rs.auth.zssAuth"].zssUsername, session["com.rs.auth.zssAuth"].zssCookies);
    }
    
  }
  onmessage(messageEvent: MessageEvent): void {
    try {
      //console.log('FTA onmessage ' + messageEvent.data);
      if (messageEvent.data instanceof Buffer) {
        console.log('binary data received ' + messageEvent.data.byteLength);
        this.handleBinaryData(messageEvent.data);
      } else {
        console.log('non binary data received ' + messageEvent.data);
        this.handleMessage(<FTAMessage>JSON.parse(messageEvent.data));
      }
    } catch(err) {
      console.error(err);
    }
  }
  onclose(closeEvent: CloseEvent): void {
    console.log('FTA onclose');
    if (this.remoteConnection) {
      this.remoteConnection.disconnect();
    }
    this.localConnection.disconnect();
  }
  onerror(event: Event): void {
    console.log('FTA onerror ' + event);
  }
  handleMessage(message: FTAMessage) {
    if (message.type === FTAMessageType.CONNECT) {
      let connectOptions: FTAConnectOptions = <FTAConnectOptions>message.payload;
      let remoteConnection: FTAConnection;
      try {
        remoteConnection = this.getConnectionForProtocol(FTASide.REMOTE, connectOptions.protocol);
      } catch(err) {
        return this.sendError(message.type, err.message);
      }
      remoteConnection.on(FTAConnectionEvents.CONNECT, (err: Error) => {
        if (err) {
          this.sendError(message.type, err.message);
        } else {
          this.sendSuccess(message.type);
        }
      });
      remoteConnection.on(FTAConnectionEvents.ERROR, (err: Error, side: FTASide, type: FTAMessageType) => {
        this.sendError(message.type, err.message);
      });
      try {
        remoteConnection.connect(connectOptions.target);
      } catch (err) {
        return this.sendError(message.type, err.message);
      }
      this.remoteConnection = remoteConnection;
    } else if(message.type === FTAMessageType.DISCONNECT) {
      if (this.remoteConnection) {
        console.log('disconnect');
        this.remoteConnection.disconnect();
        this.sendSuccess(message.type);
      } else {
        console.log('not connected');
      }
    } else if(message.type === FTAMessageType.LS) {
      let lsPath: FTAPath = <FTAPath>message.payload;
      let lsHandler = (err, list: FTAFileInfo[]) => {
          if (err) {
            return this.handleError(message.type, err);
          }
          this.sendData(message.type, new FTAFolder(lsPath.side, lsPath.path, list));
      };
      if (lsPath.side == FTASide.LOCAL) {
        this.localConnection.ls(lsPath.path, lsHandler);
      } else if (this.remoteConnection) {
        this.remoteConnection.ls(lsPath.path, lsHandler);
      } else {
        this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.getHomePath) {
      let side: FTASide = <FTASide>message.payload;
      let resolvePathHander = (err, absPath) => {
          if (err) {
            return this.sendError(message.type, err.message);
          }
          console.log('getHomePath result: ' + absPath);
          this.sendData(message.type, new FTAPath(side, absPath));
      };
      if (side == FTASide.LOCAL) {
        this.localConnection.getHomePath(resolvePathHander);
      } else if (this.remoteConnection) {
        this.remoteConnection.getHomePath(resolvePathHander);
      } else {
        this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.fastGet) {
      if (!this.remoteConnection) {
        return this.sendError(message.type, "not connected");
      }
      let pathes: string[] = <string[]>message.payload;
      console.log('download file ' + pathes[0] + ' to ' + pathes[1]);
      this.remoteConnection.fastGet(pathes[0], pathes[1], (err: any) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        this.sendSuccess(message.type);
      });
    } else if (message.type === FTAMessageType.fastPut) {
      if (!this.remoteConnection) {
        return this.sendError(message.type, "not connected");
      }
      let pathes: string[] = <string[]>message.payload;
      this.remoteConnection.fastPut(pathes[0], pathes[1], (err) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        this.sendSuccess(message.type);
      });
    } else if (message.type === FTAMessageType.makeDir) {
      let pathToCreate: FTAPath = <FTAPath>message.payload;
      var statsHandler = (err: any, fileInfo: FTAFileInfo) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        this.sendData(message.type, [pathToCreate, fileInfo]);
      };
      var mdHandler = (err) => {
          if (err) {
            return this.handleError(message.type, err, context);
          }
          if (pathToCreate.side == FTASide.LOCAL) {
            this.localConnection.stats(pathToCreate.path, statsHandler);
          } else if (this.remoteConnection) {
            this.remoteConnection.stats(pathToCreate.path, statsHandler);
          } else {
            return this.sendError(message.type, "not connected");
          }
      };
      if (pathToCreate.side == FTASide.LOCAL) {
        this.localConnection.md(pathToCreate.path, mdHandler);
      } else if (this.remoteConnection) {
        this.remoteConnection.md(pathToCreate.path, mdHandler);
      } else {
        return this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.rmdir) {
      let pathToDelete: FTAPath = <FTAPath>message.payload;
      var rmHandler = (err: any) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        this.sendData(message.type, pathToDelete);
      };
      if (pathToDelete.side == FTASide.LOCAL) {
        this.localConnection.rmdir(pathToDelete.path, rmHandler);
      } else if (this.remoteConnection) {
        this.remoteConnection.rmdir(pathToDelete.path, rmHandler);
      } else {
        return this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.delete) {
      let pathToDelete: FTAPath = <FTAPath>message.payload;
      var rmHandler = (err: any) => {
        if (err) {
          return this.handleError(message.type, err);
        }
        this.sendData(message.type, pathToDelete);
      };
      if (pathToDelete.side == FTASide.LOCAL) {
        this.localConnection.delete(pathToDelete.path, rmHandler);
      } else if (this.remoteConnection) {
        this.remoteConnection.delete(pathToDelete.path, rmHandler);
      } else {
        return this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.rename) {
      let pathes: any[] = <any[]>message.payload;
      let pathToRename: FTAPath = <FTAPath>pathes[0];
      let newPath: string = <string>pathes[1];
      var renameHandler = (err: any) => {
        if (err) {
          return this.handleError(message.type, err);
        }
        this.sendData(message.type, [pathToRename, newPath]);
      };
      if (pathToRename.side == FTASide.LOCAL) {
        this.localConnection.rename(pathToRename.path, newPath, renameHandler);
      } else if (this.remoteConnection) {
        this.remoteConnection.rename(pathToRename.path, newPath, renameHandler);
      } else {
        return this.sendError(message.type, "not connected");
      }
    } else if (message.type === FTAMessageType.fopen) {
      let modePath: any[] = <any[]>message.payload;
      let mode: FTAFileMode = <FTAFileMode>modePath[0];
      let filePath: FTAPath = <FTAPath>modePath[1];
      var sideCode: number = -1;
      var streamId: number = -1;
      var stream: any;
      var context: any[] = [mode, filePath];
      let streamReadyHandler = (err: any, newStreamId: number, newStream: any) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        streamId = newStreamId;
        stream = newStream;
        this.sendData(message.type, [mode, filePath, newStreamId]);
      }
      let readHandler = (err, streamId, data) => {
        if (err) {
          return this.handleError(message.type, err, context);
        }
        this.sendBinaryData(sideCode, streamId, data);
      }
      let endHandler = (err) => {
        this.sendData(FTAMessageType.fclose, [err, streamId]);
      }
      if (filePath.side == FTASide.LOCAL) {
        sideCode = 0;
        if (mode == FTAFileMode.read) {
          this.localConnection.createReadStream(filePath.path, streamReadyHandler, readHandler, endHandler);
        } else if (mode == FTAFileMode.write) {
          this.localConnection.createWriteStream(filePath.path, streamReadyHandler, endHandler);
        } else {
          return this.sendError(message.type, "unknown file mode " + mode);
        }
      } else if (filePath.side == FTASide.REMOTE && this.remoteConnection) {
        sideCode = 1;
        if (mode == FTAFileMode.read) {
          this.remoteConnection.createReadStream(filePath.path, streamReadyHandler, readHandler, endHandler);
        } else if (mode == FTAFileMode.write) {
          this.remoteConnection.createWriteStream(filePath.path, streamReadyHandler, endHandler);
        } else {
          return this.sendError(message.type, "unknown file mode " + mode);
        }
      } else {
        return this.sendError(message.type, "side not connected " + filePath.side);
      }
    } else if (message.type === FTAMessageType.fclose) {
      let sideModeStream: any[] = <any[]>message.payload;
      let side: FTASide = <FTASide>sideModeStream[0];
      //let mode: FTAFileMode = <FTAFileMode>sideModeStream[1];
      var streamId: number = <number>sideModeStream[2];
      if (side == FTASide.LOCAL) {
        this.localConnection.closeStream(streamId);
      } else if (side == FTASide.REMOTE && this.remoteConnection) {
        this.remoteConnection.closeStream(streamId);
      }
    } else if (message.type === FTAMessageType.pipeLR) {
      //two files path to open on local and remote sides and pipe them
      let localRemotePath: any[] = <any[]>message.payload;
      if (!this.localConnection || !this.remoteConnection) {
        return this.sendError(message.type, "not connected", localRemotePath);
      }
      let localPath: string = <string>localRemotePath[0];
      let remotePath: string = <string>localRemotePath[1];
      var readStreamId = -1;
      var writeStreamId = -1;
      this.localConnection.createReadStream(localPath, 
        (err: any, localStreamId: number, readStream: any) => {
          if (err) {
            return this.sendError(message.type, err, localRemotePath);
          }
          console.log('pipeLR local read streamId ' + localStreamId);
          readStreamId = localStreamId;
          this.remoteConnection.createWriteStream(remotePath, 
            (err: any, remoteStreamId: number, writeStream: any) => {
              if (err) {
                this.localConnection.closeStream(localStreamId);
                return this.sendError(message.type, err, localRemotePath);
              }
              console.log('pipeLR remote write streamId ' + remoteStreamId);
              writeStreamId = remoteStreamId;
              readStream.pipe(writeStream);
            });
        }, 
      (err, streamId, chunk) => {
        if (err) {
          this.localConnection.closeStream(readStreamId);
          this.sendError(message.type, err, localRemotePath);
        } else {
          
          this.sendData(message.type, [localPath, remotePath, readStreamId, writeStreamId, chunk.byteLength, false]);
        }
      }, 
      (err, streamId) => {
        if (err) {
          this.remoteConnection.closeStream(writeStreamId);
          this.localConnection.closeStream(readStreamId);
          console.error('end error ' + err + ' streamId=' + streamId);
        }
        this.sendData(message.type, [localPath, remotePath, readStreamId, writeStreamId, 0, true]);
      });
    } else if (message.type === FTAMessageType.pipeRL) {
      let pipeRLArgs: any[] = <any[]>message.payload;
      if (!this.localConnection || !this.remoteConnection) {
        return this.sendError(message.type, "not connected", pipeRLArgs);
      }
      let remotePath: string = <string>pipeRLArgs[0];
      let localPath: string = <string>pipeRLArgs[1];
      var readStreamId = -1;
      var writeStreamId = -1;
      this.remoteConnection.createReadStream(remotePath, 
        (err: any, remoteStreamId: number, readStream: any) => {
          if (err) {
            return this.sendError(message.type, err, pipeRLArgs);
          }
          console.log('pipeRL remote read streamId ' + remoteStreamId);
          readStreamId = remoteStreamId;
          this.localConnection.createWriteStream(localPath, 
            (err: any, localStreamId: number, writeStream: any) => {
              if (err) {
                this.remoteConnection.closeStream(remoteStreamId);
                return this.sendError(message.type, err, pipeRLArgs);
              }
              console.log('pipeRL local write streamId ' + localStreamId);
              writeStreamId = localStreamId;
              readStream.pipe(writeStream);
            });
        }, 
      (err, streamId, chunk) => {
        if (err) {
          this.remoteConnection.closeStream(readStreamId);
          this.sendError(message.type, err, pipeRLArgs);
        } else {
          this.sendData(message.type, [remotePath, localPath, readStreamId, writeStreamId, chunk.byteLength, false]);
        }
      }, 
      (err, streamId) => {
        //this.remoteConnection.closeStream(readStreamId);
        //this.localConnection.closeStream(writeStreamId);
        this.sendData(message.type, [remotePath, localPath, readStreamId, writeStreamId, 0, true]);
      });
    } else {
      console.log('FTA Unhandled message type ' + message.type);
      this.sendError(message.type, 'FTA Unhandled message type ' + message.type);
    }
  }

  handleBinaryData(data: Buffer): void {
    var binData: FTABinaryData = FTABinaryData.parseMessage(data);
    console.log('binary data msgVersion=' + binData.msgVersion + ' sideCode=' + binData.sideCode + ' streamId=' + binData.streamId);
    var context: number[] = [binData.sideCode, binData.streamId];
    var buffer: Buffer = binData.data;
    if (binData.sideCode == 0) {
      var stream: any = this.localConnection.getStream(binData.streamId);
      if (stream) {
        this.localConnection.writeToStream(stream, buffer, (err) => {
          if (err) {
            console.error(err);
            return this.sendError(FTAMessageType.data, 'writeToStream error ' + err, context);
          }
          this.sendData(FTAMessageType.data, [binData.sideCode, binData.streamId, buffer.byteLength]);
        });
      } else {
        return this.sendError(FTAMessageType.data, 'no writeStream ' + binData.streamId, context);
      }
    } else {
      var stream: any = this.remoteConnection.getStream(binData.streamId);
      if (stream) {
        this.remoteConnection.writeToStream(stream, buffer, (err) => {
          if (err) {
            console.error(err);
            return this.sendError(FTAMessageType.data, 'writeToStream error ' + err, context);
          }
          this.sendData(FTAMessageType.data, [binData.sideCode, binData.streamId, buffer.byteLength]);
        });
      } else {
        return this.sendError(FTAMessageType.data, 'no writeStream ' + binData.streamId, context);
      }
    }
    
  }

  handleError(type: FTAMessageType, err: any, errorContext?: any): void {
    if (err !== null && typeof err === 'object' && 'message' in err) {
      return this.sendError(type, err.message, errorContext);
    } else {
      return this.sendError(type, err, errorContext);
    }
  }

  sendError(type: FTAMessageType, errMessage: string, errorContext?: any): void {
    var err: FTAError = new FTAError(errMessage);
    err.errorContext = errorContext;
    this.send(new FTAMessage(type, err));
  }

  sendSuccess(type: FTAMessageType) {
    this.send(new FTAMessage(type, new FTASuccess()));
  }

  sendData(type: FTAMessageType, data: FTAPayload) {
    this.send(new FTAMessage(type, data));
  }

  send(message: FTAMessage) {
    //if (this.websocket.readyState === WebSocket.OPEN) {
      console.log('FTA.send ' + JSON.stringify(message));
      this.websocket.send(JSON.stringify(message));
    /*} else {
      console.log('Websocket readyState=' + this.websocket.readyState);
    }*/
  }

  sendBinaryData(sideCode: number, streamId: number, data: Buffer) {
    console.log('FTA.sendBinaryData length=' + data.length + ' sideCode=' + sideCode + ' streamId=' + streamId);
    this.websocket.send(FTABinaryData.buildNodeMessage(0, sideCode, streamId, data));
  }
  
  getConnectionForProtocol(side: FTASide, protocol: string): FTAConnection {
    if (protocol === "sftp") {
      return new SFTPConnection(side);
    } else if (protocol === "ftp") {
      return new FTPConnection(side);
    } else {
      throw new Error(protocol + ' protocol not Implemented');
    }
  }

  public toString(): string {
    return 'FTAWebsocketProxy for ' + this.clientIP + ':' + this.clientPort;
  }
}

exports.fsRouter = function(context): Router {
  return new bbPromise(function(resolve, reject) {
    let router = express.Router();
    router.use(function abc(req,res,next) {
      context.logger.info('FTA Saw Websocket request, method='+req.method);      
      next();
    });
    router.ws('/',function(ws,req) {
      console.log('FTAWebsocketProxy creating');
      new FTAWebsocketProxy(req.ip, req.port, context, req.session, ws);
    });
    resolve(router);
  });
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

