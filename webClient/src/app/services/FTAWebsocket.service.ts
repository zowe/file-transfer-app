
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
//import { Observer } from 'rxjs/Observer';
import {FTAMessageType, FTAMessage, FTAConnectOptions, FTAError, FTAConnectionTarget, FTAFileInfo, FTASide, FTAPath, FTAFolder, FTABinaryData, FTAFileMode} from '../../../../common/FTATypes';

@Injectable()
export class FTAWebsocketService extends EventEmitter<any> {
  private ws: WebSocket;
  private handlersMap: Map<string, any[]> = new Map<string, any[]>();
  private completeHandlersMap: Map<string, any[]> = new Map<string, any[]>();
  public remoteConnected: boolean = false;

  constructor(http: HttpClient) {
    super();
  }

  private addHandler(name: string, handler: any): void {
    let handlers: any[] | undefined = this.handlersMap.get(name);
    if (!handlers) {
      handlers = [];
      this.handlersMap.set(name, handlers);
    }
    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }
  }

  private invokeAll(name: string, args: any[]) {
    const handlers: any[] | undefined = this.handlersMap.get(name);
    if (handlers) {
      handlers.forEach(handler => {
        handler.apply(this, args);
      });
    }
  }

  private addCompleteHandler(name: string, handler: any): void {
    // TODO tomeout handler for all all entries
    let handlers: any[] | undefined = this.completeHandlersMap.get(name);
    if (!handlers) {
      handlers = [];
      this.completeHandlersMap.set(name, handlers);
    }
    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }
  }

  public invokeComplete(name: string, complete: boolean, args: any[]): void {
    const handlers: any[] | undefined = this.completeHandlersMap.get(name);
    if (handlers) {
      if (complete) {
        this.completeHandlersMap.delete(name);
        console.log('handlers complete ' + name);
      }
      handlers.forEach(handler => {
        handler.apply(this, args);
      });
    } else {
      console.log('no complete handler ' + name);
    }
  }

  public removeListener(name: string, handler?: any) {
    const handlers: any[] | undefined = this.handlersMap.get(name);
    console.log('removeListener ' + name + ': ' + handlers)
    if (handler && handlers && handlers.includes(handler)) {
      console.log('removeListener handlers includes ' + handler)
      handlers.splice(handlers.indexOf(handler), 1);
      console.log('removeListener splice ' + handlers);
      if (handlers.length === 0) {
        this.handlersMap.delete(name);
      }
    } else if (!handler) {
      this.handlersMap.delete(name);
    }
  }

  public onError(handler: (err: any) => void): void {
    this.addHandler('error', handler);
  }

  public removeErrorListener(handler: any) {
    this.removeListener('error', handler);
  }

  public connect(url: string) {
    try {
      this.ws = new WebSocket(url);
      this.ws.binaryType = 'arraybuffer';
      this.ws.onmessage = (ev: MessageEvent) => {
        if (ev.data instanceof ArrayBuffer) {
          const binData: FTABinaryData = FTABinaryData.parseMessage(new DataView(ev.data));
          this.handleBinaryData(binData);
        } else {
          console.log('onmessage ' + ev.data);
          this.handleMessage(<FTAMessage>JSON.parse(ev.data));
        }
      };
      this.ws.onopen = (ev: Event) => this.wsOnOpen(ev);
    } catch (err) {
      this.invokeAll('error', [err]);
    }
  }

  public disconnect() {
    console.log('ws close');
    this.ws.close();
  }

  public onConnect(handler: (err: Error, connected: boolean) => void): void {
    this.addHandler('connect', handler);
  }
  private wsOnOpen(ev: Event) {
    this.invokeAll('connect', [null, true]);
  }

  public onRemoteConnect(handler: (err: Error, connected: boolean) => void): void {
    this.addHandler('targetConnect', handler);
  }
  public remoteConnect(protocol: string, address: string, port: number, username: string, password: string) {
    console.log('sendConnect protocol=' + protocol + ' address=' + address + ' port=' + port);
    this.send(new FTAMessage(FTAMessageType.CONNECT,
      new FTAConnectOptions(protocol, new FTAConnectionTarget(address, port, username, password))));
  }

  public send(object: any): boolean {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log('FTA.send ' + JSON.stringify(object));
      this.ws.send(JSON.stringify(object));
      return true;
    } else {
      let errMessage = 'Websocket readyState=' + this.ws.readyState;
      console.log(errMessage);
      this.invokeAll('error', [errMessage]);
      return false;
    }
  }

  public sendBinary(sideCode: number, streamId: number, buffer: ArrayBuffer, sent: (err: any, length: number) => void): boolean {
    this.addCompleteHandler('data:' + sideCode + ':' + streamId, sent);
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log('FTA.send buffer length=' + buffer.byteLength);
      this.ws.send(FTABinaryData.buildMessage(0, sideCode, streamId, buffer));
      return true;
    } else {
      let errMessage = 'Websocket readyState=' + this.ws.readyState;
      console.log(errMessage);
      this.invokeAll('error', [errMessage]);
      return false;
    }
  }

  private handleMessage(message: FTAMessage): void {
    console.log('handleMessage type=' + message.type);
    if (message.type === FTAMessageType.CONNECT) {
      if ('errorMessage' in message.payload) {
        const err = <FTAError>message.payload;
        this.remoteConnected = false;
        this.invokeAll('targetConnect', [new Error(err.errorMessage), false]);
      } else {
        console.log('before call targetConnect');
        this.remoteConnected = true;
        this.invokeAll('targetConnect', [null, true]);
      }
    } else if (message.type === FTAMessageType.LS) {
      if ('path' in message.payload) {
        const folder: FTAFolder = <FTAFolder>message.payload;
        this.invokeAll('targetLs', [null, folder.side, folder.path, folder.content]);
      } else {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('targetLs', [error.errorMessage, null, null]);
      }
    } else if (message.type === FTAMessageType.getHomePath) {
      if ('path' in message.payload) {
        const path: FTAPath = <FTAPath>message.payload;
        this.invokeAll('resolvePath', [null, path.side, path.path]);
      } else {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('resolvePath', [error.errorMessage, null, null]);
      }
    } else if (message.type === FTAMessageType.fastGet) {
      if ('success' in message.payload) {
        this.invokeAll('fastGet', [null, 1]);
      } else {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('fastGet', [error.errorMessage, 0]);
      }
    } else if (message.type === FTAMessageType.fastPut) {
      if ('success' in message.payload) {
        this.invokeAll('fastPut', [null, 1]);
      } else {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('fastPut', [error.errorMessage, 0]);
      }
    } else if (message.type === FTAMessageType.makeDir) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('makeDir', [error.errorMessage]);
      } else {
        const pathInfo: any[] = <any[]>message.payload;
        const pathCreated: FTAPath = <FTAPath>pathInfo[0];
        const info: FTAFileInfo = <FTAFileInfo>pathInfo[1];
        this.invokeAll('makeDir', [null, pathCreated.side, pathCreated.path, info]);
      }
    } else if (message.type === FTAMessageType.rmdir) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('delete', [error.errorMessage]);
      } else {
        const pathDeleted: FTAPath = <FTAPath>message.payload;
        this.invokeAll('delete', [null, pathDeleted.side, pathDeleted.path]);
      }
    } else if (message.type === FTAMessageType.delete) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('delete', [error.errorMessage]);
      } else {
        const pathDeleted: FTAPath = <FTAPath>message.payload;
        this.invokeAll('delete', [null, pathDeleted.side, pathDeleted.path]);
      }
    } else if (message.type === FTAMessageType.rename) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        this.invokeAll('rename', [error.errorMessage]);
      } else {
        const pathes: any[] = <any[]>message.payload;
        const oldPath: FTAPath = pathes[0];
        const newPath: string = <string>pathes[1];
        this.invokeAll('rename', [null, oldPath.side, oldPath.path, newPath]);
      }
    } else if(message.type == FTAMessageType.fopen) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        if (error.errorContext) {
          //const mode: FTAFileMode = <FTAFileMode>error.errorContext[0];
          const openPath: FTAPath = <FTAPath>error.errorContext[1];
          return this.invokeComplete('fopen:' + openPath.path, true, [error.errorMessage]);
        }
        this.invokeAll('error', [error.errorMessage]);
      } else {
        const modePathStream: any[] = <any[]>message.payload;
        //let mode: FTAFileMode = <FTAFileMode>modePathStream[0];
        const filePath: FTAPath = <FTAPath>modePathStream[1];
        const newStreamId: number = <number>modePathStream[2];
        this.invokeComplete('fopen:' + filePath.path, true, [null, newStreamId]);
      }
    } else if (message.type === FTAMessageType.fclose) {
      const errStream: any[] = <any[]>message.payload;
      const err: string = <string>errStream[0];
      const streamId: number = <number>errStream[1];
      setImmediate(() => {
        this.invokeAll('end:' + streamId, []);
        this.invokeComplete('fclose:' + streamId, true, [err]);
        this.removeListener('end:' + streamId);
        this.removeListener('data:' + streamId);
      });
    } else if (message.type === FTAMessageType.data) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        let sideCode: number = <number>error.errorContext[0];
        let streamId: number = <number>error.errorContext[1];
        return this.invokeComplete('data:' + sideCode + ':' + streamId, true, [error.errorMessage]);
      }
      const dataArgs: any[] = <any[]>message.payload;
      const sideCode: number = <number>dataArgs[0];
      const streamId: number = <number>dataArgs[1];
      const length: number = <number>dataArgs[2];
      return this.invokeComplete('data:' + sideCode + ':' + streamId, true, [null, length]);
    } else if(message.type == FTAMessageType.pipeLR) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        const localFilePath: string = <string>error.errorContext[0];
        const remoteFilePath: string = <string>error.errorContext[1];
        return this.invokeComplete('pipeLR:' + localFilePath + ':' + remoteFilePath, true, [error.errorMessage]);
      }
      const pipeArgs: any[] = <any[]>message.payload;
      const localFilePath: string = <string>pipeArgs[0];
      const remoteFilePath: string = <string>pipeArgs[1];
      const readStreamId: number = <number>pipeArgs[2];
      const writeStreamId: number = <number>pipeArgs[3];
      const chunkSize: number = <number>pipeArgs[4];
      const complete: boolean = <boolean>pipeArgs[5];
      this.invokeComplete('pipeLR:' + localFilePath + ':' + remoteFilePath,
        complete, [null, readStreamId, writeStreamId, chunkSize, complete]);
    } else if(message.type == FTAMessageType.pipeRL) {
      if ('errorMessage' in message.payload) {
        const error: FTAError = <FTAError>message.payload;
        const remoteFilePath: string = <string>error.errorContext[0];
        const localFilePath: string = <string>error.errorContext[1];
        return this.invokeComplete('pipeRL:' + remoteFilePath + ':' + localFilePath, true, [error.errorMessage]);
      }
      const pipeArgs: any[] = <any[]>message.payload;
      const remoteFilePath: string = <string>pipeArgs[0];
      const localFilePath: string = <string>pipeArgs[1];
      const readStreamId: number = <number>pipeArgs[2];
      const writeStreamId: number = <number>pipeArgs[3];
      const chunkSize: number = <number>pipeArgs[4];
      const complete: boolean = <boolean>pipeArgs[5];
      this.invokeComplete('pipeRL:' + remoteFilePath + ':' + localFilePath, complete,
        [null, readStreamId, writeStreamId, chunkSize, complete]);
    } else {
      const errmsg = 'unhandled message type=' + message.type;
      console.log(errmsg);
      this.invokeAll('error', [errmsg]);
    }
  }

  handleBinaryData(binData: FTABinaryData): void {
    console.log('handleBinaryData msgVersion=' + binData.msgVersion + ' ' + binData.sideCode + ' ' + binData.streamId);
    this.invokeAll('data:' + binData.streamId, [binData]);
  }

  public onLs(handler: (err: any, system: FTASide, path: string, fileInfos: FTAFileInfo[]) => void): void {
    this.addHandler('targetLs', handler);
  }
  public ls(side: FTASide, path: string): void {
    console.log('ls side=' + side + ' path=' + path);
    this.send(new FTAMessage(FTAMessageType.LS, new FTAPath(side, path)));
  }

  public onHomePath(handler: (err: any, system: FTASide, path: string) => void): void {
    this.addHandler('resolvePath', handler);
  }
  public getHomePath(side: FTASide): void {
    console.log('getHomePath side=' + side);
    this.send(new FTAMessage(FTAMessageType.getHomePath, side));
  }

  public onFastPut(handler: (err: any, progress: number) => void): void {//TODO may be return attributes of uploaded file?
    this.addHandler('fastPut', handler);
  }
  public fastPut(localPath: string, remotePath: string): void{
    console.log('fastPut localPath=' + localPath + ' remotePath=' + remotePath);
    this.send(new FTAMessage(FTAMessageType.fastPut, [localPath, remotePath]));
  }

  public onFastGet(handler: (err: any, progress: number) => void): void {//TODO may be return attributes of downloaded file?
    this.addHandler('fastGet', handler);
  }

  public fastGet(remotePath: string, localPath: string): void {
    console.log('fastGet remotePath=' + remotePath + ' localPath=' + localPath);
    this.send(new FTAMessage(FTAMessageType.fastGet, [remotePath, localPath]));
  }

  public onMd(handler: (err: any, side: FTASide, path: string, fileinfo: FTAFileInfo) => void): void {
    this.addHandler('makeDir', handler);
  }
  public md(side: FTASide, pathToCrate: string): void {
    console.log('md side=' + side + ' pathToCrate=' + pathToCrate);
    this.send(new FTAMessage(FTAMessageType.makeDir, new FTAPath(side, pathToCrate)));
  }

  public onDelete(handler: (err: any, side: FTASide, path: string) => void): void {
    this.addHandler('delete', handler);
  }
  public rmdir(side: FTASide, pathToDelete: string): void {
    console.log('rmdir side=' + side + ' pathToDelete=' + pathToDelete);
    this.send(new FTAMessage(FTAMessageType.rmdir, new FTAPath(side, pathToDelete)));
  }
  public delete(side: FTASide, pathToDelete: string): void {
    console.log('delete side=' + side + ' pathToDelete=' + pathToDelete);
    this.send(new FTAMessage(FTAMessageType.delete, new FTAPath(side, pathToDelete)));
  }

  public onRename(handler: (err: any, side: FTASide, oldPath: string, newPath: string) => void): void {
    this.addHandler('rename', handler);
  }
  public rename(side: FTASide, pathToRename: string, newPath: string): void {
    console.log('rename side=' + side + ' pathToRename=' + pathToRename + ' newPath=' + newPath);
    this.send(new FTAMessage(FTAMessageType.rename, [new FTAPath(side, pathToRename), newPath]));
  }

  public fopen(side: FTASide, pathToOpen: string, mode: FTAFileMode, onOpen: (err: any, streamId: number) => void): void {
    this.addCompleteHandler('fopen:' + pathToOpen, onOpen);
    this.send(new FTAMessage(FTAMessageType.fopen, [mode, new FTAPath(side, pathToOpen)]));
  }

  public fclose(side: FTASide, streamId: number, mode: FTAFileMode, errHandler: (err: any) => void): void {
    this.addCompleteHandler('fclose:' + streamId, errHandler);
    this.send(new FTAMessage(FTAMessageType.fclose, [side, mode, streamId]));
  }

  public onBinaryData(streamId: number, handler: (data: FTABinaryData) => void, completeHandler: () => void): void {
    this.addHandler('data:' + streamId, handler);
    this.addHandler('end:' + streamId, completeHandler);
  }

  public pipeLR(localFilePath: string, remoteFilePath: string,
    handler: (err: any, readStreamId: number, writeStreamId: number, chunkSize: number, complete: boolean) => void): void {
    this.addCompleteHandler('pipeLR:' + localFilePath + ':' + remoteFilePath, handler);
    this.send(new FTAMessage(FTAMessageType.pipeLR, [localFilePath, remoteFilePath]));
  }

  public pipeRL(remoteFilePath: string, localFilePath: string,
    handler: (err: any, readStreamId: number, writeStreamId: number, chunkSize: number, complete: boolean) => void): void {
    this.addCompleteHandler('pipeRL:' + remoteFilePath + ':' + localFilePath, handler);
    this.send(new FTAMessage(FTAMessageType.pipeRL, [remoteFilePath, localFilePath]));
  }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
