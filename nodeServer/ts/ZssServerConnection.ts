
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { FTAConnectionTarget, FTAFileInfo, FTAFileAttributes, LinuxStatsMask, FTASide } from "../../common/FTATypes";
import { FTAConnection, FTAErrorHandler, FTAConnectionEvents } from "./FTAConnection";

const httpEndpoint = '/unixfile/contents';
var http = require('http');

var httpRequest = function(method, hostname, port, path, cookie, data, handler, httpAgent, timeout = 5000) {
    var streamReadyHandler = null;
    var str = '';
    var dataHandler = function (chunk) {
        str += chunk;
    }
    var endHandler = function () {
        var cookie;
        if (this.statusCode === 200 && this.headers['set-cookie']) {
            cookie = this.headers['set-cookie'][0]
        }
        if (handler) {
            setImmediate(handler, null, this.statusCode, str, cookie);
        }
    };
    var errorHandler = function (err) {
        handler(err);
    };
    httpRequest2(method, hostname, port, path, cookie, data, streamReadyHandler, dataHandler, endHandler, errorHandler, httpAgent, timeout);
}

var httpRequest2 = function(method, hostname, port, path, cookie, data, streamReadyHandler, dataHandler, endHandler, errorHandler, httpAgent, timeout = 5000) {
    var opts = {
        hostname: hostname,
        port: port,
        path: path,
        method: method,
        agent: httpAgent,
        headers: {
        }
      };
    if (cookie) {
        opts.headers['Cookie'] = cookie;
    }
    if (data) {
        var len = Buffer.byteLength(data);
        opts.headers['Content-Length'] = len;
        opts.headers['content-type'] = 'application/json';
    }
    
    try {
        var timeoutTimer: any;
        var request = http.request(opts, function (response) {
            if (streamReadyHandler) {
                streamReadyHandler(null, response);
            }
            response.on('data', ()=>{
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                    request.removeListener('timeout', timeoutHandler);
                }
                timeoutTimer = request.setTimeout(timeout, timeoutHandler);
            });
            if (dataHandler) {
                response.on('data', dataHandler);
            }
            if (endHandler) {
                response.on('end', endHandler.bind(response));
            }
        }).on('error', errorHandler);
        var timeoutHandler = function() {
            request.end();
            errorHandler("timeout");
        }
        timeoutTimer = request.setTimeout(timeout, timeoutHandler);
        if (streamReadyHandler) {
            streamReadyHandler(request, null);
        } else if (data) {
            request.write(data, function() {
                request.end();
            });
        } else {
            request.end();
        }
    } catch (err) {
        errorHandler(err);
    }
}

export class ZssServerConnection extends FTAConnection {
    zssHost: string;
    zssPort: number;
    zssUsername: string;
    zssCookies: string;
    httpAgent: any = http.Agent({keepAlive: true});//keepAliveMsecs
    constructor(side: FTASide, zssHost: string, zssPort: number, zssUsername: string, zssCookies: string) {
        super(side);
        this.zssHost = zssHost;
        this.zssPort = zssPort;
        this.zssUsername = zssUsername;
        this.zssCookies = zssCookies;
    }
  connect(to: FTAConnectionTarget): void {
    
  }
  disconnect(): void {
    super.disconnect();
  }
  toString(): string {
    return 'Zss Connection';
  }
  ls(path: string, handler: (err: any, list: FTAFileInfo[]) => void): void {
    httpRequest('GET', this.zssHost, this.zssPort, httpEndpoint + path, this.zssCookies, null, (err, code, data, cookie) => {
        if (!err) {
            console.log('unixFileContents: ' + data);
            let result: FTAFileInfo[] = [];
            try {
                var entries = JSON.parse(data).entries;
                entries.forEach((entry) => {
                    var attrs: FTAFileAttributes = new FTAFileAttributes();
                    attrs.isDirectory = entry.directory;
                    attrs.size = entry.size;
                    attrs.mode = entry.mode;
                    result.push(new FTAFileInfo(this.side, entry.name, attrs));
                });
            } catch (parseErr) {
                return handler(parseErr, null);
            }
            handler(null, result);
        } else {
            handler(err, null);
        }
    }, this.httpAgent);
  }
  getHomePath(handler: (err: any, absPath) => void): void {
    /*httpRequest('GET', this.zssHost, this.zssPort, '/getenv/HOME', this.zssCookies, null, (err, code, data, cookie) => {
        if (code == 200) {
            console.log('/getenv/HOME: ' + data);
            var envResponce: any = JSON.parse(data);
            if (envResponce && envResponce.val) {
                return handler(null, envResponce.val);
            }
        }
        handler(null, '/');
    }, this.httpAgent);*/
    handler(null, '/u/' + this.zssUsername);//workaround for now
  }
  fastGet(srcPath: string, dstPathLocal: string, handler: (err: any) => void): void {
    handler('not supported yet');
  }
  fastPut(srcLocalPath: string, dstRemotePath: string, handler: (err: any) => void): void {
    handler('not supported yet');
  }
  md(path: string, handler: (err: any) => void): void {
    handler('not supported yet');
  }
  stats(path: string, handler: (err: any, fileInfo: FTAFileInfo) => void): void {
    handler('not supported yet', null);
  }
  rmdir(path: string, handler: (err: any) => void): void {
    handler('not supported yet');
  }
  delete(path: string, handler: (err: any) => void): void {
    handler('not supported yet');
  }
  rename(pathToRename: string, newPath: string, renameHandler: (err: any) => void): void {
    renameHandler('not supported yet');
  }
  createReadStream(pathToFile: string, readyHandler: (err: any, streamId?: number, readStream?: any) => void, dataHandler?: (err: any, streamId: number, data: Buffer) => void, end?: (err: any, streamId: number) => void): void {
    httpRequest2('GET', this.zssHost, this.zssPort, httpEndpoint + pathToFile, this.zssCookies, null, (writeStream, readStream) => {
        if (writeStream) {//http request
            writeStream.end();
        }
        if (readStream) {//http responce
            if (readStream.statusCode == 200) {
                var streamId: number = this.addStream(readStream);
                this.readStreamAddHandler(streamId, readStream, dataHandler, end);
                readyHandler(null, streamId, readStream);
            } else {
                var errMessage = '';
                readStream.on('data', function (chunk) {
                    errMessage += chunk;
                });
                readStream.on('end', function () {
                    readyHandler('statusCode = ' + readStream.statusCode + ' message=' + errMessage);
                });
            }
        } 
        
    }, 
    null, 
    null, 
    (err) => {
        readyHandler(err);
    }, this.httpAgent);
  }
  createWriteStream(pathToFile: string, readyHandler: (err: any, streamId?: number, writeStream?: any) => void, end?: (err: any, streamId?: number) => void): void {
    httpRequest2('POST', this.zssHost, this.zssPort, '/unixFileContents' + pathToFile, this.zssCookies, null, (writeStream, readStream) => {
        var streamId: number;
        if (writeStream) {//http request
            streamId = this.addStream(writeStream);
            readyHandler(null, streamId, writeStream);
        }
        if (readStream) {
            var errMessage = '';
            readStream.on('data', function (chunk) {
                errMessage += chunk;
            });
            readStream.on('end', function () {
                if (readStream.statusCode == 200) {
                    if (end) end(null, streamId);
                } else {
                    if (end) end('statusCode = ' + readStream.statusCode + ' message=' + errMessage);
                }
            });
        }
    }, 
    null, 
    null, 
    (err) => {
        if (end) end(err);
    }, this.httpAgent);
  }
  
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
