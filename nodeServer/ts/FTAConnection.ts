
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import {EventEmitter} from 'events';
import {FTAConnectionTarget, FTAFileInfo, FTASide} from "../../common/FTATypes";

//Serverside interfaces for different protocol implementations like ftp, sftp
export type FTAErrorHandler = (err: Error)=>void;

export enum FTAConnectionEvents {
  ERROR = 'error',
  CONNECT = 'connect',
}

export abstract class FTAConnection extends EventEmitter {
    side: FTASide;
    streamMap: Map<number, any> = new Map();

    protected constructor(side: FTASide) {
      super();
      this.side = side;
    }

    abstract toString(): string;
    getStream(streamId: number): any {
      return this.streamMap.get(streamId);
    }

    addStream(stream: any, endHandler?: (err: any, streamId?: number) => void): number {
      var streamId: number = this.streamMap.size;
      this.streamMap.set(streamId, stream);
      if (endHandler) {
        stream.___FTAConnectionClose = (err) => {
          endHandler(err, streamId);
        }
      }

      var closeHandler = () => {
        this.removeStream(streamId);
        console.log(this.toString() + ': stream closed ' + streamId);
      }
      stream.on('close', closeHandler);
      stream.on('finish', closeHandler);

      return streamId;
    }
    hasStream(streamId: number): boolean {
      return this.streamMap.has(streamId);
    }
    removeStream(streamId: number): boolean {
      return this.streamMap.delete(streamId);
    }
    closeStream(streamId: number, err?: any): boolean {
      var stream: any = this.getStream(streamId);
      this.closeStreamInternal(stream, err);
      return this.removeStream(streamId);
    }
    closeStreamInternal(stream: any, err?: any) {
      //IncomingMessage and ClientRequest has no close method, end instead
      if (stream) {
        if (stream.close) {
          stream.close();
        } else if (stream.end) {
          stream.end();
        } else {
          console.error('unknown stream type ' + stream);
        }
        if (stream.___FTAConnectionClose) {
          stream.___FTAConnectionClose(err);
        }
      } else {
        console.error('stream not defined');
      }
    }
    writeToStream(writeStream: any, data: Buffer, handler: (err: any) => void): void {
      if (writeStream) {
          try {
              writeStream.write(data, handler);
          } catch (err) {
              return handler(err);
          }
      } else {
          handler('stream is missing');
      }
    }
    readStreamAddHandler(streamId: number, readStream: any, dataHandler: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void {
      if (dataHandler) {
        readStream.on('data', (chunk) => {
          dataHandler(null, streamId, chunk);
        });
      }
      readStream.on('end', () => {
          this.closeStreamInternal(readStream);
          this.removeStream(streamId);
          if (end) {
              end(null, streamId);
          }
      });
    }
    disconnect(): void {
      this.streamMap.forEach((stream,streamId,map)=>{
        this.closeStreamInternal(stream);
      });
      this.streamMap.clear();
    }

    abstract connect(to: FTAConnectionTarget): void;
    abstract getHomePath(handler: (err: any, absPath) => void): void;
    abstract ls(path: string, handler: (err: any, list: FTAFileInfo[]) => void): void;
    abstract fastGet(srcPath: string, dstPathLocal: string, handler: (err: any) => void): void;//from local filesystem
    abstract fastPut(srcLocalPath: string, dstRemotePath: string, handler: (err: any) => void): void;//to local filesystem
    abstract md(path: string, handler: (err: any) => void): void;
    abstract stats(path: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void;
    abstract rmdir(path: string, handler: (err: any) => void): void;
    abstract delete(path: string, handler: (err: any) => void): void;
    abstract rename(pathToRename: string, newPath: string, renameHandler: (err: any) => void): void;
    abstract createReadStream(pathToFile: string, readyHandler: (err: any, streamId?: number, readStream?: any) => void, dataHandler?: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void;
    abstract createWriteStream(pathToFile: string, readyhandler: (err: any, streamId?: number, writeStream?: any) => void, end?: (err: any, streamId: number) => void): void;
    
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
