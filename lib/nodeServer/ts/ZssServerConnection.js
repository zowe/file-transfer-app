"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
var FTATypes_1 = require("../../common/FTATypes");
var FTAConnection_1 = require("./FTAConnection");
var http = require('http');
var httpRequest = function (method, hostname, port, path, cookie, data, handler, httpAgent, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    var streamReadyHandler = null;
    var str = '';
    var dataHandler = function (chunk) {
        str += chunk;
    };
    var endHandler = function () {
        var cookie;
        if (this.statusCode === 200 && this.headers['set-cookie']) {
            cookie = this.headers['set-cookie'][0];
        }
        if (handler) {
            setImmediate(handler, null, this.statusCode, str, cookie);
        }
    };
    var errorHandler = function (err) {
        handler(err);
    };
    httpRequest2(method, hostname, port, path, cookie, data, streamReadyHandler, dataHandler, endHandler, errorHandler, httpAgent, timeout);
};
var httpRequest2 = function (method, hostname, port, path, cookie, data, streamReadyHandler, dataHandler, endHandler, errorHandler, httpAgent, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    var opts = {
        hostname: hostname,
        port: port,
        path: path,
        method: method,
        agent: httpAgent,
        headers: {}
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
        var timeoutTimer;
        var request = http.request(opts, function (response) {
            if (streamReadyHandler) {
                streamReadyHandler(null, response);
            }
            response.on('data', function () {
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
        var timeoutHandler = function () {
            request.end();
            errorHandler("timeout");
        };
        timeoutTimer = request.setTimeout(timeout, timeoutHandler);
        if (streamReadyHandler) {
            streamReadyHandler(request, null);
        }
        else if (data) {
            request.write(data, function () {
                request.end();
            });
        }
        else {
            request.end();
        }
    }
    catch (err) {
        errorHandler(err);
    }
};
var ZssServerConnection = /** @class */ (function (_super) {
    __extends(ZssServerConnection, _super);
    function ZssServerConnection(side, zssHost, zssPort, zssUsername, zssCookies) {
        var _this = _super.call(this, side) || this;
        _this.httpAgent = http.Agent({ keepAlive: true }); //keepAliveMsecs
        _this.zssHost = zssHost;
        _this.zssPort = zssPort;
        _this.zssUsername = zssUsername;
        _this.zssCookies = zssCookies;
        return _this;
    }
    ZssServerConnection.prototype.connect = function (to) {
    };
    ZssServerConnection.prototype.disconnect = function () {
        _super.prototype.disconnect.call(this);
    };
    ZssServerConnection.prototype.toString = function () {
        return 'Zss Connection';
    };
    ZssServerConnection.prototype.ls = function (path, handler) {
        var _this = this;
        httpRequest('GET', this.zssHost, this.zssPort, '/unixFileContents' + path, this.zssCookies, null, function (err, code, data, cookie) {
            if (!err) {
                console.log('unixFileContents: ' + data);
                var result_1 = [];
                try {
                    var entries = JSON.parse(data).entries;
                    entries.forEach(function (entry) {
                        var attrs = new FTATypes_1.FTAFileAttributes();
                        attrs.isDirectory = entry.directory;
                        attrs.size = entry.size;
                        attrs.mode = entry.mode;
                        result_1.push(new FTATypes_1.FTAFileInfo(_this.side, entry.name, attrs));
                    });
                }
                catch (parseErr) {
                    return handler(parseErr, null);
                }
                handler(null, result_1);
            }
            else {
                handler(err, null);
            }
        }, this.httpAgent);
    };
    ZssServerConnection.prototype.getHomePath = function (handler) {
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
        handler(null, '/u/' + this.zssUsername); //workaround for now
    };
    ZssServerConnection.prototype.fastGet = function (srcPath, dstPathLocal, handler) {
        handler('not supported yet');
    };
    ZssServerConnection.prototype.fastPut = function (srcLocalPath, dstRemotePath, handler) {
        handler('not supported yet');
    };
    ZssServerConnection.prototype.md = function (path, handler) {
        handler('not supported yet');
    };
    ZssServerConnection.prototype.stats = function (path, handler) {
        handler('not supported yet', null);
    };
    ZssServerConnection.prototype.rmdir = function (path, handler) {
        handler('not supported yet');
    };
    ZssServerConnection.prototype["delete"] = function (path, handler) {
        handler('not supported yet');
    };
    ZssServerConnection.prototype.rename = function (pathToRename, newPath, renameHandler) {
        renameHandler('not supported yet');
    };
    ZssServerConnection.prototype.createReadStream = function (pathToFile, readyHandler, dataHandler, end) {
        var _this = this;
        httpRequest2('GET', this.zssHost, this.zssPort, '/unixFileContents' + pathToFile, this.zssCookies, null, function (writeStream, readStream) {
            if (writeStream) { //http request
                writeStream.end();
            }
            if (readStream) { //http responce
                if (readStream.statusCode == 200) {
                    var streamId = _this.addStream(readStream);
                    _this.readStreamAddHandler(streamId, readStream, dataHandler, end);
                    readyHandler(null, streamId, readStream);
                }
                else {
                    var errMessage = '';
                    readStream.on('data', function (chunk) {
                        errMessage += chunk;
                    });
                    readStream.on('end', function () {
                        readyHandler('statusCode = ' + readStream.statusCode + ' message=' + errMessage);
                    });
                }
            }
        }, null, null, function (err) {
            readyHandler(err);
        }, this.httpAgent);
    };
    ZssServerConnection.prototype.createWriteStream = function (pathToFile, readyHandler, end) {
        var _this = this;
        httpRequest2('POST', this.zssHost, this.zssPort, '/unixFileContents' + pathToFile, this.zssCookies, null, function (writeStream, readStream) {
            var streamId;
            if (writeStream) { //http request
                streamId = _this.addStream(writeStream);
                readyHandler(null, streamId, writeStream);
            }
            if (readStream) {
                var errMessage = '';
                readStream.on('data', function (chunk) {
                    errMessage += chunk;
                });
                readStream.on('end', function () {
                    if (readStream.statusCode == 200) {
                        if (end)
                            end(null, streamId);
                    }
                    else {
                        if (end)
                            end('statusCode = ' + readStream.statusCode + ' message=' + errMessage);
                    }
                });
            }
        }, null, null, function (err) {
            if (end)
                end(err);
        }, this.httpAgent);
    };
    return ZssServerConnection;
}(FTAConnection_1.FTAConnection));
exports.ZssServerConnection = ZssServerConnection;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=ZssServerConnection.js.map