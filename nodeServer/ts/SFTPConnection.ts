
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { FTAConnectionTarget, FTAFileInfo, FTAFileAttributes, LinuxStatsMask, FTASide } from "../../common/FTATypes";
import { FTAConnection, FTAErrorHandler, FTAConnectionEvents } from "./FTAConnection";
import * as path from 'path';
const SFTPClient = require('ssh2').Client;


export class SFTPConnection extends FTAConnection {
    private client: any;
    private sftp: any;
    private host: any;
    private port: any;
    constructor(side: FTASide) {
        super(side);
        this.client = new SFTPClient();
        this.client.on('ready', function() {
            console.log('ssh2 client ready');
            this.client.sftp(function(err, sftp) {
                console.log('ssh2 sftp');
                if (err) {
                    this.emit(FTAConnectionEvents.ERROR, err);
                    return;
                }
                this.sftp = sftp;
                this.emit(FTAConnectionEvents.CONNECT);
            }.bind(this));
        }.bind(this));
        this.client.on('error', (err) => {
            this.emit(FTAConnectionEvents.ERROR, err);
        });
    }
    toString(): string {
        return 'SFTP Connection';
    }
    connect(to: FTAConnectionTarget): void {
        this.client.connect({
            host: to.host,
            port: to.port,
            username: to.username,
            password: to.password
        });
        this.host = to.host;
        this.port = to.port;
    }
    disconnect(): void {
        super.disconnect();
        console.log('close SFTP connection ' + this.host + ':' + this.port);
        this.client.end();
    }
    ls(path: string, handler: (err: any, list: FTAFileInfo[]) => void): void {
        this.sftp.readdir(path, (err, list) => {
            if (!err) {
                //console.log('ls path=' + path + ' ' + JSON.stringify(list));
                let result: FTAFileInfo[] = [];
                list.forEach((fileinfo: any) => {
                    var attrs: FTAFileAttributes = new FTAFileAttributes();
                    attrs.isDirectory = (fileinfo.attrs.mode & LinuxStatsMask.S_IFMT) == LinuxStatsMask.S_IFDIR;
                    attrs.size = fileinfo.attrs.size;
                    attrs.mode = fileinfo.attrs.mode;
                    result.push(new FTAFileInfo(this.side, fileinfo.filename, attrs));
                });
                handler(null, result);
            } else {
                handler(err, null);
            }
        });
    }
    getHomePath(handler: (err: any, absPath) => void): void {
        this.sftp.realpath('.', (err, absPath) => {
            handler(err, absPath);
        });
    }

    fastGet(srcPath: string, dstPathLocal: string, handler: (err: any) => void): void {
        this.sftp.fastGet(srcPath, dstPathLocal, {}, function (err) {
            handler(err);
        });
    }
    fastPut(srcLocalPath: string, dstRemotePath: string, handler: (err: any) => void): void {
        this.sftp.fastPut(srcLocalPath, dstRemotePath, {}, function (err) {
            handler(err);
        });
    }
    md(path: string, handler: (err: any) => void): void {
        this.sftp.mkdir(path, handler);
    }
    stats(fullPath: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void {
        this.sftp.stat(fullPath, (err, stats) => {
            console.log('stats of ' + fullPath + ": " + stats);
            if (err) {
                return handler(err, null);
            } else {
                var attr: FTAFileAttributes = new FTAFileAttributes();
                var fileInfo: FTAFileInfo = new FTAFileInfo(this.side, path.basename(fullPath), attr);
                attr.isDirectory = (stats.mode & LinuxStatsMask.S_IFMT) == LinuxStatsMask.S_IFDIR;
                attr.size = stats.size;
                attr.mode = stats.mode;
                return handler(null, fileInfo);
            }
        });
    }
    rmdir(pathToDelete: string, handler: (err: any) => void): void {
        this.sftp.rmdir(pathToDelete, handler);
    }
    delete(pathToDelete: string, handler: (err: any) => void): void {
        this.sftp.unlink(pathToDelete, handler);
    }
    rename(pathToRename: string, newPath: string, renameHandler: (err: any) => void): void {
        this.sftp.rename(pathToRename, newPath, renameHandler);
    }
    createReadStream(pathToFile: string, readyHandler: (err: any, streamId?: number, readStream?: any) => void, dataHandler?: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void {
        try {
            var readStream: any = this.sftp.createReadStream(pathToFile);
            var streamId = this.addStream(readStream);
            if (dataHandler) {
                this.readStreamAddHandler(streamId, readStream, dataHandler, end);
            }
            readyHandler(null, streamId, readStream);
        } catch (err) {
            return readyHandler(err);
        }
    }
    createWriteStream(pathToFile: string, readyHandler: (err: any, streamId?: number, writeStream?: any) => void, end?: (err: any, streamId?: number) => void): void {
        try {
            var writeStream: any = this.sftp.createWriteStream(pathToFile);
            var streamId = this.addStream(writeStream, end);
            readyHandler(null, streamId, writeStream);
        } catch (err) {
            return end(err);
        }
    }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
