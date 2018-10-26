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
var fs = require("fs");
var path = require("path");
var bbPromise = require('bluebird');
var LocalConnection = /** @class */ (function (_super) {
    __extends(LocalConnection, _super);
    function LocalConnection(side) {
        return _super.call(this, side) || this;
    }
    LocalConnection.prototype.connect = function (to) {
    };
    LocalConnection.prototype.disconnect = function () {
        _super.prototype.disconnect.call(this);
    };
    LocalConnection.prototype.toString = function () {
        return 'FTA Local';
    };
    LocalConnection.prototype.ls = function (dir, handler) {
        var _this = this;
        if (dir == '/' && process.platform === "win32") {
            var exec = require('child_process').exec;
            exec('wmic logicaldisk get name', function (error, stdout, stderr) {
                if (error) {
                    return handler(error, null);
                }
                console.log('logicaldisk result: ', stdout);
                var promises = [];
                var list = [];
                var rows = stdout.split('\n');
                rows.forEach(function (row) {
                    if (row && row.indexOf(':') > 0) {
                        var drive = row.substr(0, 1); //C:\___
                        var promise = new bbPromise(function (resolve, reject) {
                            //this.stat(drive + ':', drive, list, resolve);
                            _this.statsInternal(dir, drive, drive + ':', function (err, fileInfo) {
                                list.push(fileInfo);
                                return resolve();
                            });
                        });
                        promises.push(promise);
                    }
                });
                bbPromise.all(promises).then(function () {
                    handler(null, list);
                })["catch"](function (err) {
                    handler(err, null);
                });
            });
            return;
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                return handler(err, null);
            }
            var list = [];
            var promises = files.map(function (fileName) {
                return new bbPromise(function (resolve, reject) {
                    _this.statsInternal(dir, fileName, null, function (err, fileInfo) {
                        list.push(fileInfo);
                        return resolve();
                    });
                });
            });
            bbPromise.all(promises).then(function () {
                handler(null, list);
            })["catch"](function (err) {
                handler(err, null);
            });
        });
    };
    LocalConnection.prototype.getHomePath = function (handler) {
        fs.realpath('~', function (err, absPath) {
            if (err) {
                return handler(err, null);
            }
            console.log('realpath result ' + absPath);
            handler(null, absPath);
        });
    };
    LocalConnection.prototype.fastGet = function (srcPath, dstPathLocal, handler) {
        return handler('not supported');
    };
    LocalConnection.prototype.fastPut = function (srcLocalPath, dstRemotePath, handler) {
        return handler('not supported');
    };
    LocalConnection.prototype.md = function (path, handler) {
        fs.mkdir(path, handler);
    };
    LocalConnection.prototype.stats = function (filePath, handler) {
        var dirname = path.dirname(filePath);
        var filename = path.basename(filePath);
        this.statsInternal(dirname, filename, null, handler);
    };
    LocalConnection.prototype.statsInternal = function (dir, fileName, fullPath, handler) {
        var attr = new FTATypes_1.FTAFileAttributes();
        var fileInfo = new FTATypes_1.FTAFileInfo(this.side, fileName, attr);
        if (!fullPath) {
            fullPath = path.join(dir, fileName);
        }
        fs.stat(fullPath, function (err, stats) {
            if (err) {
                console.error(err);
                attr.error = err.message;
                return handler(err, fileInfo);
            }
            attr.isDirectory = stats.isDirectory();
            attr.mode = stats.mode; //TODO os name
            attr.size = stats.size;
            //TODO other
            return handler(err, fileInfo);
        });
    };
    LocalConnection.prototype.rmdir = function (pathToDelete, handler) {
        fs.rmdir(pathToDelete, handler);
    };
    LocalConnection.prototype["delete"] = function (pathToDelete, handler) {
        fs.unlink(pathToDelete, handler);
    };
    LocalConnection.prototype.rename = function (pathToRename, newPath, renameHandler) {
        fs.rename(pathToRename, newPath, renameHandler);
    };
    LocalConnection.prototype.createReadStream = function (pathToFile, readyHandler, dataHandler, end) {
        try {
            var readStream = fs.createReadStream(pathToFile);
            var streamId = this.addStream(readStream);
            if (dataHandler) {
                this.readStreamAddHandler(streamId, readStream, dataHandler, end);
            }
            readyHandler(null, streamId, readStream);
        }
        catch (err) {
            return readyHandler(err);
        }
    };
    LocalConnection.prototype.createWriteStream = function (pathToFile, readyHandler, end) {
        try {
            var writeStream = fs.createWriteStream(pathToFile);
            var streamId = this.addStream(writeStream, end);
            readyHandler(null, streamId, writeStream);
        }
        catch (err) {
            return end(err);
        }
    };
    return LocalConnection;
}(FTAConnection_1.FTAConnection));
exports.LocalConnection = LocalConnection;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=LocalConnection.js.map