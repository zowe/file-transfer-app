
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { FTAConnection, FTAErrorHandler, FTAConnectionEvents } from "./FTAConnection";
import { FTAConnectionTarget, FTAFileInfo, FTAFileAttributes, LinuxStatsMask, FTASide } from "../../common/FTATypes";
var Client = require('ftp');
var PassThroughStream = require('stream').PassThrough
import * as path from 'path';

export class FTPConnection extends FTAConnection {
    private client: any;
    private host: string;
    private port: number;
    constructor(side: FTASide) {
        super(side);
    }
    toString(): string {
        return 'FTP Connection';
    }
    connect(to: FTAConnectionTarget): void {
        var client = new Client();
        client.on('ready', () => {
            this.client = client;
            this.emit(FTAConnectionEvents.CONNECT);
        });
        client.on('error', (err) => {
            this.client = client;
            this.emit(FTAConnectionEvents.ERROR, err);
        });
        client.connect({
            host: to.host,
            port: to.port,
            user: to.username,
            password: to.password,
            secure : true,
            secureOptions: { rejectUnauthorized: false }
        });
        this.host = to.host;
        this.port = to.port;
    }
    disconnect(): void {
        super.disconnect();
        console.log('close FTP connection ' + this.host + ':' + this.port);
        this.client.end();
    }
    getHomePath(handler: (err: any, absPath) => void): void {
        this.client.pwd((err: any, currentDir: string) => {
            if (err) {
                return handler(err, null);
            }
            return handler(null, currentDir);
        });
    }
    ls(path: string, handler: (err: any, list: FTAFileInfo[]) => void): void {
        this.client.list(path, (err, list) => {
            if (err) {
                return handler(err, null);
            }
            console.log(list);
            let result: FTAFileInfo[] = [];
            list.forEach((fileinfo: any) => {
                var attrs: FTAFileAttributes = new FTAFileAttributes();
                attrs.isDirectory = fileinfo.type == 'd';
                attrs.size = fileinfo.size;
                attrs.mode = fileinfo.rights;
                result.push(new FTAFileInfo(this.side, fileinfo.name, attrs));
            });
            handler(null, result);
        });
    }
    fastGet(srcPath: string, dstPathLocal: string, handler: (err: any) => void): void {//from local filesystem
        return handler('not supported yet');
    }
    fastPut(srcLocalPath: string, dstRemotePath: string, handler: (err: any) => void): void {//to local filesystem
        return handler('not supported yet');
    }
    md(path: string, handler: (err: any) => void): void {
        this.client.mkdir(path, false, handler);
    }
    stats(filePath: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void {
        //TODO find out how to get stats better way
        var parentPath = path.dirname(filePath);
        var filename = path.basename(filePath);
        this.client.list(parentPath, (err, list) => {
            if (err) {
                return handler(err, null);
            }
            var result: FTAFileInfo;
            list.forEach((fileinfo: any) => {
                if (fileinfo.name == filename) {
                    var attrs: FTAFileAttributes = new FTAFileAttributes();
                    attrs.isDirectory = fileinfo.type == 'd';
                    attrs.size = fileinfo.size;
                    attrs.mode = fileinfo.rights;
                    return result = new FTAFileInfo(this.side, fileinfo.name, attrs);
                }
            });
            if (result) {
                handler(null, result);
            } else {
                handler('not found', null);
            }
        });
    }
    rmdir(path: string, handler: (err: any) => void): void {
        this.client.rmdir(path, false, handler);
    }
    delete(path: string, handler: (err: any) => void): void {
        this.client.delete(path, handler);
    }
    rename(pathToRename: string, newPath: string, renameHandler: (err: any) => void): void {
        this.client.rename(pathToRename, newPath, renameHandler);
    }
    createReadStream(pathToFile: string, readyHandler: (err: any, streamId?: number, readStream?: any) => void, dataHandler?: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void {
        this.client.get(pathToFile, (err, stream) => {
            if (err) {
                return readyHandler(err);
            }
            var streamId: number = this.addStream(stream);
            //TODO may be add these handlers from readyHandler? so avoid two parameters
            if (dataHandler) {
                this.readStreamAddHandler(streamId, stream, dataHandler, end);
            }
            readyHandler(null, streamId, stream);
          });
    }
    createWriteStream(pathToFile: string, readyhandler: (err: any, streamId?: number, writeStream?: any) => void, end?: (err: any, streamId: number) => void): void {
        var pass = new PassThroughStream();
        var streamId: number = this.addStream(pass);
        readyhandler(null, streamId, pass);
        this.client.put(pass, pathToFile, (err) => {
            if (end) {
                end(err, streamId);
            }
        });
    }
    
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
