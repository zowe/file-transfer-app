"use strict";
exports.__esModule = true;
var FTATypes_1 = require("../../common/FTATypes");
var FTAConnection_1 = require("./FTAConnection");
var SFTPConnection_1 = require("./SFTPConnection");
var FTPConnection_1 = require("./FTPConnection");
//import { LocalConnection } from "./LocalConnection";
var ZssServerConnection_1 = require("./ZssServerConnection");
var SFTPConnector_1 = require("./SFTPConnector");
//import { WebSocket } from '@types/websocket';
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
var express = require('express');
var expressWs = require('express-ws');
var bbPromise = require('bluebird');
var http = require('http');
var FTAWebsocketProxy = /** @class */ (function () {
    function FTAWebsocketProxy(clientIP, clientPort, context, session, websocket) {
        this.clientIP = clientIP;
        this.clientPort = clientPort;
        websocket.onmessage = this.onmessage.bind(this);
        websocket.onclose = this.onclose.bind(this);
        websocket.onerror = this.onerror;
        this.websocket = websocket;
        //this.localConnection = new LocalConnection(FTASide.LOCAL);
        if (session["com.rs.auth.zssAuth"] && session["com.rs.auth.zssAuth"].authenticated) {
            this.localConnection = new ZssServerConnection_1.ZssServerConnection(FTATypes_1.FTASide.LOCAL, context.plugin.server.config.startUp.proxiedHost, context.plugin.server.config.startUp.proxiedPort, session["com.rs.auth.zssAuth"].zssUsername, session["com.rs.auth.zssAuth"].zssCookies);
        }
    }
    FTAWebsocketProxy.prototype.onmessage = function (messageEvent) {
        try {
            //console.log('FTA onmessage ' + messageEvent.data);
            if (messageEvent.data instanceof Buffer) {
                console.log('binary data received ' + messageEvent.data.byteLength);
                this.handleBinaryData(messageEvent.data);
            }
            else {
                console.log('non binary data received ' + messageEvent.data);
                this.handleMessage(JSON.parse(messageEvent.data));
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    FTAWebsocketProxy.prototype.onclose = function (closeEvent) {
        console.log('FTA onclose');
        if (this.remoteConnection) {
            this.remoteConnection.disconnect();
        }
        this.localConnection.disconnect();
    };
    FTAWebsocketProxy.prototype.onerror = function (event) {
        console.log('FTA onerror ' + event);
    };
    FTAWebsocketProxy.prototype.handleMessage = function (message) {
        var _this = this;
        if (message.type === FTATypes_1.FTAMessageType.CONNECT) {
            var connectOptions = message.payload;
            var remoteConnection = void 0;
            try {
                remoteConnection = this.getConnectionForProtocol(FTATypes_1.FTASide.REMOTE, connectOptions.protocol);
            }
            catch (err) {
                return this.sendError(message.type, err.message);
            }
            remoteConnection.on(FTAConnection_1.FTAConnectionEvents.CONNECT, function (err) {
                if (err) {
                    _this.sendError(message.type, err.message);
                }
                else {
                    _this.sendSuccess(message.type);
                }
            });
            remoteConnection.on(FTAConnection_1.FTAConnectionEvents.ERROR, function (err, side, type) {
                _this.sendError(message.type, err.message);
            });
            try {
                remoteConnection.connect(connectOptions.target);
            }
            catch (err) {
                return this.sendError(message.type, err.message);
            }
            this.remoteConnection = remoteConnection;
        }
        else if (message.type === FTATypes_1.FTAMessageType.DISCONNECT) {
            if (this.remoteConnection) {
                console.log('disconnect');
                this.remoteConnection.disconnect();
                this.sendSuccess(message.type);
            }
            else {
                console.log('not connected');
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.LS) {
            var lsPath_1 = message.payload;
            var lsHandler = function (err, list) {
                if (err) {
                    return _this.handleError(message.type, err);
                }
                _this.sendData(message.type, new FTATypes_1.FTAFolder(lsPath_1.side, lsPath_1.path, list));
            };
            if (lsPath_1.side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.ls(lsPath_1.path, lsHandler); // this separation of remote and local is unnecessary if we make an individual service to serve each browserpanel
            }
            else if (this.remoteConnection) {
                this.remoteConnection.ls(lsPath_1.path, lsHandler);
            }
            else {
                this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.getHomePath) {
            var side_1 = message.payload;
            var resolvePathHander = function (err, absPath) {
                if (err) {
                    return _this.sendError(message.type, err.message);
                }
                console.log('getHomePath result: ' + absPath);
                _this.sendData(message.type, new FTATypes_1.FTAPath(side_1, absPath));
            };
            if (side_1 == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.getHomePath(resolvePathHander);
            }
            else if (this.remoteConnection) {
                this.remoteConnection.getHomePath(resolvePathHander);
            }
            else {
                this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.fastGet) {
            if (!this.remoteConnection) {
                return this.sendError(message.type, "not connected");
            }
            var pathes = message.payload;
            console.log('download file ' + pathes[0] + ' to ' + pathes[1]);
            this.remoteConnection.fastGet(pathes[0], pathes[1], function (err) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                _this.sendSuccess(message.type);
            });
        }
        else if (message.type === FTATypes_1.FTAMessageType.fastPut) {
            if (!this.remoteConnection) {
                return this.sendError(message.type, "not connected");
            }
            var pathes = message.payload;
            this.remoteConnection.fastPut(pathes[0], pathes[1], function (err) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                _this.sendSuccess(message.type);
            });
        }
        else if (message.type === FTATypes_1.FTAMessageType.makeDir) {
            var pathToCreate_1 = message.payload;
            var statsHandler = function (err, fileInfo) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                _this.sendData(message.type, [pathToCreate_1, fileInfo]);
            };
            var mdHandler = function (err) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                if (pathToCreate_1.side == FTATypes_1.FTASide.LOCAL) {
                    _this.localConnection.stats(pathToCreate_1.path, statsHandler);
                }
                else if (_this.remoteConnection) {
                    _this.remoteConnection.stats(pathToCreate_1.path, statsHandler);
                }
                else {
                    return _this.sendError(message.type, "not connected");
                }
            };
            if (pathToCreate_1.side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.md(pathToCreate_1.path, mdHandler);
            }
            else if (this.remoteConnection) {
                this.remoteConnection.md(pathToCreate_1.path, mdHandler);
            }
            else {
                return this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.rmdir) {
            var pathToDelete_1 = message.payload;
            var rmHandler = function (err) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                _this.sendData(message.type, pathToDelete_1);
            };
            if (pathToDelete_1.side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.rmdir(pathToDelete_1.path, rmHandler);
            }
            else if (this.remoteConnection) {
                this.remoteConnection.rmdir(pathToDelete_1.path, rmHandler);
            }
            else {
                return this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType["delete"]) {
            var pathToDelete_2 = message.payload;
            var rmHandler = function (err) {
                if (err) {
                    return _this.handleError(message.type, err);
                }
                _this.sendData(message.type, pathToDelete_2);
            };
            if (pathToDelete_2.side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection["delete"](pathToDelete_2.path, rmHandler);
            }
            else if (this.remoteConnection) {
                this.remoteConnection["delete"](pathToDelete_2.path, rmHandler);
            }
            else {
                return this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.rename) {
            var pathes = message.payload;
            var pathToRename_1 = pathes[0];
            var newPath_1 = pathes[1];
            var renameHandler = function (err) {
                if (err) {
                    return _this.handleError(message.type, err);
                }
                _this.sendData(message.type, [pathToRename_1, newPath_1]);
            };
            if (pathToRename_1.side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.rename(pathToRename_1.path, newPath_1, renameHandler);
            }
            else if (this.remoteConnection) {
                this.remoteConnection.rename(pathToRename_1.path, newPath_1, renameHandler);
            }
            else {
                return this.sendError(message.type, "not connected");
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.fopen) {
            var modePath = message.payload;
            var mode_1 = modePath[0];
            var filePath_1 = modePath[1];
            var sideCode = -1;
            var streamId = -1;
            var stream;
            var context = [mode_1, filePath_1];
            var streamReadyHandler = function (err, newStreamId, newStream) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                streamId = newStreamId;
                stream = newStream;
                _this.sendData(message.type, [mode_1, filePath_1, newStreamId]);
            };
            var readHandler = function (err, streamId, data) {
                if (err) {
                    return _this.handleError(message.type, err, context);
                }
                _this.sendBinaryData(sideCode, streamId, data);
            };
            var endHandler = function (err) {
                _this.sendData(FTATypes_1.FTAMessageType.fclose, [err, streamId]);
            };
            if (filePath_1.side == FTATypes_1.FTASide.LOCAL) {
                sideCode = 0;
                if (mode_1 == FTATypes_1.FTAFileMode.read) {
                    this.localConnection.createReadStream(filePath_1.path, streamReadyHandler, readHandler, endHandler);
                }
                else if (mode_1 == FTATypes_1.FTAFileMode.write) {
                    this.localConnection.createWriteStream(filePath_1.path, streamReadyHandler, endHandler);
                }
                else {
                    return this.sendError(message.type, "unknown file mode " + mode_1);
                }
            }
            else if (filePath_1.side == FTATypes_1.FTASide.REMOTE && this.remoteConnection) {
                sideCode = 1;
                if (mode_1 == FTATypes_1.FTAFileMode.read) {
                    this.remoteConnection.createReadStream(filePath_1.path, streamReadyHandler, readHandler, endHandler);
                }
                else if (mode_1 == FTATypes_1.FTAFileMode.write) {
                    this.remoteConnection.createWriteStream(filePath_1.path, streamReadyHandler, endHandler);
                }
                else {
                    return this.sendError(message.type, "unknown file mode " + mode_1);
                }
            }
            else {
                return this.sendError(message.type, "side not connected " + filePath_1.side);
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.fclose) {
            var sideModeStream = message.payload;
            var side = sideModeStream[0];
            //let mode: FTAFileMode = <FTAFileMode>sideModeStream[1];
            var streamId = sideModeStream[2];
            if (side == FTATypes_1.FTASide.LOCAL) {
                this.localConnection.closeStream(streamId);
            }
            else if (side == FTATypes_1.FTASide.REMOTE && this.remoteConnection) {
                this.remoteConnection.closeStream(streamId);
            }
        }
        else if (message.type === FTATypes_1.FTAMessageType.pipeLR) {
            //two files path to open on local and remote sides and pipe them
            var localRemotePath_1 = message.payload;
            if (!this.localConnection || !this.remoteConnection) {
                return this.sendError(message.type, "not connected", localRemotePath_1);
            }
            var localPath_1 = localRemotePath_1[0];
            var remotePath_1 = localRemotePath_1[1];
            var readStreamId = -1;
            var writeStreamId = -1;
            this.localConnection.createReadStream(localPath_1, function (err, localStreamId, readStream) {
                if (err) {
                    return _this.sendError(message.type, err, localRemotePath_1);
                }
                console.log('pipeLR local read streamId ' + localStreamId);
                readStreamId = localStreamId;
                _this.remoteConnection.createWriteStream(remotePath_1, function (err, remoteStreamId, writeStream) {
                    if (err) {
                        _this.localConnection.closeStream(localStreamId);
                        return _this.sendError(message.type, err, localRemotePath_1);
                    }
                    console.log('pipeLR remote write streamId ' + remoteStreamId);
                    writeStreamId = remoteStreamId;
                    readStream.pipe(writeStream);
                });
            }, function (err, streamId, chunk) {
                if (err) {
                    _this.localConnection.closeStream(readStreamId);
                    _this.sendError(message.type, err, localRemotePath_1);
                }
                else {
                    _this.sendData(message.type, [localPath_1, remotePath_1, readStreamId, writeStreamId, chunk.byteLength, false]);
                }
            }, function (err, streamId) {
                if (err) {
                    _this.remoteConnection.closeStream(writeStreamId);
                    _this.localConnection.closeStream(readStreamId);
                    console.error('end error ' + err + ' streamId=' + streamId);
                }
                _this.sendData(message.type, [localPath_1, remotePath_1, readStreamId, writeStreamId, 0, true]);
            });
        }
        else if (message.type === FTATypes_1.FTAMessageType.pipeRL) {
            var pipeRLArgs_1 = message.payload;
            if (!this.localConnection || !this.remoteConnection) {
                return this.sendError(message.type, "not connected", pipeRLArgs_1);
            }
            var remotePath_2 = pipeRLArgs_1[0];
            var localPath_2 = pipeRLArgs_1[1];
            var readStreamId = -1;
            var writeStreamId = -1;
            this.remoteConnection.createReadStream(remotePath_2, function (err, remoteStreamId, readStream) {
                if (err) {
                    return _this.sendError(message.type, err, pipeRLArgs_1);
                }
                console.log('pipeRL remote read streamId ' + remoteStreamId);
                readStreamId = remoteStreamId;
                _this.localConnection.createWriteStream(localPath_2, function (err, localStreamId, writeStream) {
                    if (err) {
                        _this.remoteConnection.closeStream(remoteStreamId);
                        return _this.sendError(message.type, err, pipeRLArgs_1);
                    }
                    console.log('pipeRL local write streamId ' + localStreamId);
                    writeStreamId = localStreamId;
                    readStream.pipe(writeStream);
                });
            }, function (err, streamId, chunk) {
                if (err) {
                    _this.remoteConnection.closeStream(readStreamId);
                    _this.sendError(message.type, err, pipeRLArgs_1);
                }
                else {
                    _this.sendData(message.type, [remotePath_2, localPath_2, readStreamId, writeStreamId, chunk.byteLength, false]);
                }
            }, function (err, streamId) {
                //this.remoteConnection.closeStream(readStreamId);
                //this.localConnection.closeStream(writeStreamId);
                _this.sendData(message.type, [remotePath_2, localPath_2, readStreamId, writeStreamId, 0, true]);
            });
        }
        else {
            console.log('FTA Unhandled message type ' + message.type);
            this.sendError(message.type, 'FTA Unhandled message type ' + message.type);
        }
    };
    FTAWebsocketProxy.prototype.handleBinaryData = function (data) {
        var _this = this;
        var binData = FTATypes_1.FTABinaryData.parseMessage(data);
        console.log('binary data msgVersion=' + binData.msgVersion + ' sideCode=' + binData.sideCode + ' streamId=' + binData.streamId);
        var context = [binData.sideCode, binData.streamId];
        var buffer = binData.data;
        if (binData.sideCode == 0) {
            var stream = this.localConnection.getStream(binData.streamId);
            if (stream) {
                this.localConnection.writeToStream(stream, buffer, function (err) {
                    if (err) {
                        console.error(err);
                        return _this.sendError(FTATypes_1.FTAMessageType.data, 'writeToStream error ' + err, context);
                    }
                    _this.sendData(FTATypes_1.FTAMessageType.data, [binData.sideCode, binData.streamId, buffer.byteLength]);
                });
            }
            else {
                return this.sendError(FTATypes_1.FTAMessageType.data, 'no writeStream ' + binData.streamId, context);
            }
        }
        else {
            var stream = this.remoteConnection.getStream(binData.streamId);
            if (stream) {
                this.remoteConnection.writeToStream(stream, buffer, function (err) {
                    if (err) {
                        console.error(err);
                        return _this.sendError(FTATypes_1.FTAMessageType.data, 'writeToStream error ' + err, context);
                    }
                    _this.sendData(FTATypes_1.FTAMessageType.data, [binData.sideCode, binData.streamId, buffer.byteLength]);
                });
            }
            else {
                return this.sendError(FTATypes_1.FTAMessageType.data, 'no writeStream ' + binData.streamId, context);
            }
        }
    };
    FTAWebsocketProxy.prototype.handleError = function (type, err, errorContext) {
        if (err !== null && typeof err === 'object' && 'message' in err) {
            return this.sendError(type, err.message, errorContext);
        }
        else {
            return this.sendError(type, err, errorContext);
        }
    };
    FTAWebsocketProxy.prototype.sendError = function (type, errMessage, errorContext) {
        var err = new FTATypes_1.FTAError(errMessage);
        err.errorContext = errorContext;
        this.send(new FTATypes_1.FTAMessage(type, err));
    };
    FTAWebsocketProxy.prototype.sendSuccess = function (type) {
        this.send(new FTATypes_1.FTAMessage(type, new FTATypes_1.FTASuccess()));
    };
    FTAWebsocketProxy.prototype.sendData = function (type, data) {
        this.send(new FTATypes_1.FTAMessage(type, data));
    };
    FTAWebsocketProxy.prototype.send = function (message) {
        //if (this.websocket.readyState === WebSocket.OPEN) {
        console.log('FTA.send ' + JSON.stringify(message));
        this.websocket.send(JSON.stringify(message));
        /*} else {
          console.log('Websocket readyState=' + this.websocket.readyState);
        }*/
    };
    FTAWebsocketProxy.prototype.sendBinaryData = function (sideCode, streamId, data) {
        console.log('FTA.sendBinaryData length=' + data.length + ' sideCode=' + sideCode + ' streamId=' + streamId);
        this.websocket.send(FTATypes_1.FTABinaryData.buildNodeMessage(0, sideCode, streamId, data));
    };
    FTAWebsocketProxy.prototype.getConnectionForProtocol = function (side, protocol) {
        if (protocol === "sftp") {
            return new SFTPConnection_1.SFTPConnection(side);
        }
        else if (protocol === "ftp") {
            return new FTPConnection_1.FTPConnection(side);
        }
        else {
            throw new Error(protocol + ' protocol not Implemented');
        }
    };
    FTAWebsocketProxy.prototype.toString = function () {
        return 'FTAWebsocketProxy for ' + this.clientIP + ':' + this.clientPort;
    };
    return FTAWebsocketProxy;
}());
exports.fsRouter = function (context) {
    return new bbPromise(function (resolve, reject) {
        var router = express.Router();
        router.use(function abc(req, res, next) {
            context.logger.info('FTA Saw Websocket request, method=' + req.method);
            next();
        });
        router.ws('/', function (ws, req) {
            console.log('FTAWebsocketProxy creating');
            new FTAWebsocketProxy(req.ip, req.port, context, req.session, ws);
        });
        router.get('/', function (req, res) {
            new SFTPConnector_1.SFTPConnector();
        });
        resolve(router);
    });
};
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=FsProxyService.js.map