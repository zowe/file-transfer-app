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
var FTAConnection_1 = require("./FTAConnection");
var FTATypes_1 = require("../../common/FTATypes");
var Client = require('ftp');
var PassThroughStream = require('stream').PassThrough;
var path = require("path");
var FTPConnection = /** @class */ (function (_super) {
    __extends(FTPConnection, _super);
    function FTPConnection(side) {
        return _super.call(this, side) || this;
    }
    FTPConnection.prototype.toString = function () {
        return 'FTP Connection';
    };
    FTPConnection.prototype.connect = function (to) {
        var _this = this;
        var client = new Client();
        client.on('ready', function () {
            _this.client = client;
            _this.emit(FTAConnection_1.FTAConnectionEvents.CONNECT);
        });
        client.on('error', function (err) {
            _this.client = client;
            _this.emit(FTAConnection_1.FTAConnectionEvents.ERROR, err);
        });
        client.connect({
            host: to.host,
            port: to.port,
            user: to.username,
            password: to.password,
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        this.host = to.host;
        this.port = to.port;
    };
    FTPConnection.prototype.disconnect = function () {
        _super.prototype.disconnect.call(this);
        console.log('close FTP connection ' + this.host + ':' + this.port);
        this.client.end();
    };
    FTPConnection.prototype.getHomePath = function (handler) {
        this.client.pwd(function (err, currentDir) {
            if (err) {
                return handler(err, null);
            }
            return handler(null, currentDir);
        });
    };
    FTPConnection.prototype.ls = function (path, handler) {
        var _this = this;
        this.client.list(path, function (err, list) {
            if (err) {
                return handler(err, null);
            }
            console.log(list);
            var result = [];
            list.forEach(function (fileinfo) {
                var attrs = new FTATypes_1.FTAFileAttributes();
                attrs.isDirectory = fileinfo.type == 'd';
                attrs.size = fileinfo.size;
                attrs.mode = fileinfo.rights;
                result.push(new FTATypes_1.FTAFileInfo(_this.side, fileinfo.name, attrs));
            });
            handler(null, result);
        });
    };
    FTPConnection.prototype.fastGet = function (srcPath, dstPathLocal, handler) {
        return handler('not supported yet');
    };
    FTPConnection.prototype.fastPut = function (srcLocalPath, dstRemotePath, handler) {
        return handler('not supported yet');
    };
    FTPConnection.prototype.md = function (path, handler) {
        this.client.mkdir(path, false, handler);
    };
    FTPConnection.prototype.stats = function (filePath, handler) {
        var _this = this;
        //TODO find out how to get stats better way
        var parentPath = path.dirname(filePath);
        var filename = path.basename(filePath);
        this.client.list(parentPath, function (err, list) {
            if (err) {
                return handler(err, null);
            }
            var result;
            list.forEach(function (fileinfo) {
                if (fileinfo.name == filename) {
                    var attrs = new FTATypes_1.FTAFileAttributes();
                    attrs.isDirectory = fileinfo.type == 'd';
                    attrs.size = fileinfo.size;
                    attrs.mode = fileinfo.rights;
                    return result = new FTATypes_1.FTAFileInfo(_this.side, fileinfo.name, attrs);
                }
            });
            if (result) {
                handler(null, result);
            }
            else {
                handler('not found', null);
            }
        });
    };
    FTPConnection.prototype.rmdir = function (path, handler) {
        this.client.rmdir(path, false, handler);
    };
    FTPConnection.prototype["delete"] = function (path, handler) {
        this.client["delete"](path, handler);
    };
    FTPConnection.prototype.rename = function (pathToRename, newPath, renameHandler) {
        this.client.rename(pathToRename, newPath, renameHandler);
    };
    FTPConnection.prototype.createReadStream = function (pathToFile, readyHandler, dataHandler, end) {
        var _this = this;
        this.client.get(pathToFile, function (err, stream) {
            if (err) {
                return readyHandler(err);
            }
            var streamId = _this.addStream(stream);
            //TODO may be add these handlers from readyHandler? so avoid two parameters
            if (dataHandler) {
                _this.readStreamAddHandler(streamId, stream, dataHandler, end);
            }
            readyHandler(null, streamId, stream);
        });
    };
    FTPConnection.prototype.createWriteStream = function (pathToFile, readyhandler, end) {
        var pass = new PassThroughStream();
        var streamId = this.addStream(pass);
        readyhandler(null, streamId, pass);
        this.client.put(pass, pathToFile, function (err) {
            if (end) {
                end(err, streamId);
            }
        });
    };
    return FTPConnection;
}(FTAConnection_1.FTAConnection));
exports.FTPConnection = FTPConnection;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=FTPConnection.js.map