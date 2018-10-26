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
var path = require("path");
var SFTPClient = require('ssh2').Client;
var SFTPConnection = /** @class */ (function (_super) {
    __extends(SFTPConnection, _super);
    function SFTPConnection(side) {
        var _this = _super.call(this, side) || this;
        _this.client = new SFTPClient();
        _this.client.on('ready', function () {
            console.log('ssh2 client ready');
            this.client.sftp(function (err, sftp) {
                console.log('ssh2 sftp');
                if (err) {
                    this.emit(FTAConnection_1.FTAConnectionEvents.ERROR, err);
                    return;
                }
                this.sftp = sftp;
                this.emit(FTAConnection_1.FTAConnectionEvents.CONNECT);
            }.bind(this));
        }.bind(_this));
        _this.client.on('error', function (err) {
            _this.emit(FTAConnection_1.FTAConnectionEvents.ERROR, err);
        });
        return _this;
    }
    SFTPConnection.prototype.toString = function () {
        return 'SFTP Connection';
    };
    SFTPConnection.prototype.connect = function (to) {
        this.client.connect({
            host: to.host,
            port: to.port,
            username: to.username,
            password: to.password
        });
        this.host = to.host;
        this.port = to.port;
    };
    SFTPConnection.prototype.disconnect = function () {
        _super.prototype.disconnect.call(this);
        console.log('close SFTP connection ' + this.host + ':' + this.port);
        this.client.end();
    };
    SFTPConnection.prototype.ls = function (path, handler) {
        var _this = this;
        this.sftp.readdir(path, function (err, list) {
            if (!err) {
                //console.log('ls path=' + path + ' ' + JSON.stringify(list));
                var result_1 = [];
                list.forEach(function (fileinfo) {
                    var attrs = new FTATypes_1.FTAFileAttributes();
                    attrs.isDirectory = (fileinfo.attrs.mode & FTATypes_1.LinuxStatsMask.S_IFMT) == FTATypes_1.LinuxStatsMask.S_IFDIR;
                    attrs.size = fileinfo.attrs.size;
                    attrs.mode = fileinfo.attrs.mode;
                    result_1.push(new FTATypes_1.FTAFileInfo(_this.side, fileinfo.filename, attrs));
                });
                handler(null, result_1);
            }
            else {
                handler(err, null);
            }
        });
    };
    SFTPConnection.prototype.getHomePath = function (handler) {
        this.sftp.realpath('.', function (err, absPath) {
            handler(err, absPath);
        });
    };
    SFTPConnection.prototype.fastGet = function (srcPath, dstPathLocal, handler) {
        this.sftp.fastGet(srcPath, dstPathLocal, {}, function (err) {
            handler(err);
        });
    };
    SFTPConnection.prototype.fastPut = function (srcLocalPath, dstRemotePath, handler) {
        this.sftp.fastPut(srcLocalPath, dstRemotePath, {}, function (err) {
            handler(err);
        });
    };
    SFTPConnection.prototype.md = function (path, handler) {
        this.sftp.mkdir(path, handler);
    };
    SFTPConnection.prototype.stats = function (fullPath, handler) {
        var _this = this;
        this.sftp.stat(fullPath, function (err, stats) {
            console.log('stats of ' + fullPath + ": " + stats);
            if (err) {
                return handler(err, null);
            }
            else {
                var attr = new FTATypes_1.FTAFileAttributes();
                var fileInfo = new FTATypes_1.FTAFileInfo(_this.side, path.basename(fullPath), attr);
                attr.isDirectory = (stats.mode & FTATypes_1.LinuxStatsMask.S_IFMT) == FTATypes_1.LinuxStatsMask.S_IFDIR;
                attr.size = stats.size;
                attr.mode = stats.mode;
                return handler(null, fileInfo);
            }
        });
    };
    SFTPConnection.prototype.rmdir = function (pathToDelete, handler) {
        this.sftp.rmdir(pathToDelete, handler);
    };
    SFTPConnection.prototype["delete"] = function (pathToDelete, handler) {
        this.sftp.unlink(pathToDelete, handler);
    };
    SFTPConnection.prototype.rename = function (pathToRename, newPath, renameHandler) {
        this.sftp.rename(pathToRename, newPath, renameHandler);
    };
    SFTPConnection.prototype.createReadStream = function (pathToFile, readyHandler, dataHandler, end) {
        try {
            var readStream = this.sftp.createReadStream(pathToFile);
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
    SFTPConnection.prototype.createWriteStream = function (pathToFile, readyHandler, end) {
        try {
            var writeStream = this.sftp.createWriteStream(pathToFile);
            var streamId = this.addStream(writeStream, end);
            readyHandler(null, streamId, writeStream);
        }
        catch (err) {
            return end(err);
        }
    };
    return SFTPConnection;
}(FTAConnection_1.FTAConnection));
exports.SFTPConnection = SFTPConnection;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=SFTPConnection.js.map