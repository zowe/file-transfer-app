
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { FTAConnectionTarget, FTAFileInfo, FTAFileAttributes, LinuxStatsMask, FTAPath, FTASide } from "../../common/FTATypes";
import { FTAConnection, FTAErrorHandler, FTAConnectionEvents } from "./FTAConnection";
import * as fs from 'fs';
import * as path from 'path';
const bbPromise = require('bluebird');
export class LocalConnection extends FTAConnection {
    constructor(side: FTASide) {
      super(side);
    }
    connect(to: FTAConnectionTarget): void {

    }
    disconnect() {
        super.disconnect();
    }
    toString(): string {
        return 'FTA Local';
    }
    ls(dir: string, handler: (err: any, list: FTAFileInfo[]) => void): void {
        if (dir == '/' && process.platform === "win32") {
            const exec = require('child_process').exec;
            exec('wmic logicaldisk get name', (error: any, stdout: string, stderr: any) => {
                if (error) {
                    return handler(error, null);
                }
                console.log('logicaldisk result: ', stdout);
                var promises: any[] = [];
                var list: FTAFileInfo[] = [];
                var rows: string[] = stdout.split('\n');
                rows.forEach((row) => {
                    if (row && row.indexOf(':') > 0) {
                        var drive: string = row.substr(0,1);//C:\___
                        var promise: any = new bbPromise((resolve, reject) => {
                            //this.stat(drive + ':', drive, list, resolve);
                            this.statsInternal(dir, drive, drive + ':', (err, fileInfo) => {
                                list.push(fileInfo);
                                return resolve();
                            });
                        });
                        promises.push(promise);
                    }
                });
                bbPromise.all(promises).then(()=>{
                    handler(null,list);
                }).catch((err) => {
                    handler(err,null);
                });
            });
            return;
        }
          fs.readdir(dir, (err, files: string[]) => {
            if (err) {
              return handler(err, null);
            }
            var list: FTAFileInfo[] = [];
            const promises = files.map((fileName) => 
              new bbPromise((resolve, reject) => {
                this.statsInternal(dir, fileName, null, (err, fileInfo) => {
                    list.push(fileInfo);
                    return resolve();
                });
              })
            );
            bbPromise.all(promises).then(()=>{
              handler(null,list);
            }).catch((err) => {
              handler(err,null);
            });
          });
    }
    getHomePath(handler: (err: any, absPath) => void): void {
        fs.realpath('~', (err, absPath: string) => {
            if (err) {
              return handler(err, null);
            }
            console.log('realpath result ' + absPath);
            handler(null, absPath);
        });
    }
    fastGet(srcPath: string, dstPathLocal: string, handler: (err: any) => void): void {
        return handler('not supported');
    }
    fastPut(srcLocalPath: string, dstRemotePath: string, handler: (err: any) => void): void {
        return handler('not supported');
    }
    md(path: string, handler: (err: any) => void): void {
        fs.mkdir(path, handler);
    }
    stats(filePath: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void {
        var dirname = path.dirname(filePath);
        var filename = path.basename(filePath);
        this.statsInternal(dirname, filename, null, handler);
    }
    statsInternal(dir: string, fileName: string, fullPath: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void {
        var attr: FTAFileAttributes = new FTAFileAttributes();
        var fileInfo = new FTAFileInfo(this.side, fileName, attr);
        if (!fullPath) {
            fullPath = path.join(dir, fileName);
        }
        fs.stat(fullPath, (err, stats) => {
            if (err) {
              console.error(err);
              attr.error = err.message;
              return handler(err, fileInfo);
            }
            attr.isDirectory = stats.isDirectory();
            attr.mode = stats.mode;//TODO os name
            attr.size = stats.size;
            //TODO other
            return handler(err, fileInfo);
        });
    }
    rmdir(pathToDelete: string, handler: (err: any) => void): void {
        fs.rmdir(pathToDelete, handler);
    }
    delete(pathToDelete: string, handler: (err: any) => void): void {
        fs.unlink(pathToDelete, handler);
    }
    rename(pathToRename: string, newPath: string, renameHandler: (err: any) => void): void {
        fs.rename(pathToRename, newPath, renameHandler);
    }
    createReadStream(pathToFile: string, readyHandler: (err: any, streamId?: number, readStream?: any) => void, dataHandler?: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void {
        try {
            var readStream: any = fs.createReadStream(pathToFile);
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
            var writeStream: any = fs.createWriteStream(pathToFile);
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
