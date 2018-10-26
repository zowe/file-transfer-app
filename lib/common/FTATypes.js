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
//both serverside and clientside contracts for interacting between them
var FTAMessageType;
(function (FTAMessageType) {
    FTAMessageType["CONNECT"] = "connect";
    FTAMessageType["DISCONNECT"] = "disconnect";
    FTAMessageType["LS"] = "ls";
    FTAMessageType["getHomePath"] = "getHomePath";
    FTAMessageType["fastGet"] = "fastGet";
    FTAMessageType["fastPut"] = "fastPut";
    FTAMessageType["makeDir"] = "makeDir";
    FTAMessageType["rmdir"] = "rmdir";
    FTAMessageType["delete"] = "delete";
    FTAMessageType["rename"] = "rename";
    FTAMessageType["fopen"] = "fopen";
    FTAMessageType["fclose"] = "fclose";
    FTAMessageType["cancel"] = "cancel";
    FTAMessageType["data"] = "data";
    FTAMessageType["pipeLR"] = "pipeLR";
    FTAMessageType["pipeRL"] = "pipeRL";
})(FTAMessageType = exports.FTAMessageType || (exports.FTAMessageType = {}));
var FTASide;
(function (FTASide) {
    FTASide["LOCAL"] = "local";
    FTASide["REMOTE"] = "remote";
})(FTASide = exports.FTASide || (exports.FTASide = {}));
var FTAPayload = /** @class */ (function () {
    function FTAPayload() {
    }
    return FTAPayload;
}());
exports.FTAPayload = FTAPayload;
var FTAMessage = /** @class */ (function () {
    function FTAMessage(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    return FTAMessage;
}());
exports.FTAMessage = FTAMessage;
var FTAConnectionTarget = /** @class */ (function () {
    function FTAConnectionTarget(host, port, username, password) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }
    return FTAConnectionTarget;
}());
exports.FTAConnectionTarget = FTAConnectionTarget;
var FTAConnectOptions = /** @class */ (function (_super) {
    __extends(FTAConnectOptions, _super);
    function FTAConnectOptions(protocol, target) {
        var _this = _super.call(this) || this;
        _this.protocol = protocol;
        _this.target = target;
        return _this;
    }
    return FTAConnectOptions;
}(FTAPayload));
exports.FTAConnectOptions = FTAConnectOptions;
var FTAError = /** @class */ (function (_super) {
    __extends(FTAError, _super);
    function FTAError(errorMessage) {
        var _this = _super.call(this) || this;
        _this.errorMessage = errorMessage;
        return _this;
    }
    return FTAError;
}(FTAPayload));
exports.FTAError = FTAError;
var FTASuccess = /** @class */ (function (_super) {
    __extends(FTASuccess, _super);
    function FTASuccess() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.success = true;
        return _this;
    }
    return FTASuccess;
}(FTAPayload));
exports.FTASuccess = FTASuccess;
var LinuxStatsMask = /** @class */ (function () {
    function LinuxStatsMask() {
    }
    LinuxStatsMask.S_IFMT = 0xF000; //0170000
    LinuxStatsMask.S_IFDIR = 0x4000; //0040000
    return LinuxStatsMask;
}());
exports.LinuxStatsMask = LinuxStatsMask;
var FTAFileAttributes = /** @class */ (function (_super) {
    __extends(FTAFileAttributes, _super);
    function FTAFileAttributes() {
        return _super.call(this) || this;
    }
    return FTAFileAttributes;
}(FTAPayload));
exports.FTAFileAttributes = FTAFileAttributes;
var FTAFileInfo = /** @class */ (function (_super) {
    __extends(FTAFileInfo, _super);
    function FTAFileInfo(side, name, attributes) {
        var _this = _super.call(this) || this;
        _this.side = side;
        _this.name = name;
        _this.attributes = attributes;
        return _this;
    }
    FTAFileInfo.prototype.isDirectory = function () {
        return this.attributes && this.attributes.isDirectory;
    };
    return FTAFileInfo;
}(FTAPayload));
exports.FTAFileInfo = FTAFileInfo;
var FTAFolder = /** @class */ (function (_super) {
    __extends(FTAFolder, _super);
    function FTAFolder(side, path, content) {
        var _this = _super.call(this) || this;
        _this.side = side;
        _this.path = path;
        _this.content = content;
        return _this;
    }
    return FTAFolder;
}(FTAPayload));
exports.FTAFolder = FTAFolder;
var FTAPath = /** @class */ (function (_super) {
    __extends(FTAPath, _super);
    function FTAPath(side, path) {
        var _this = _super.call(this) || this;
        _this.side = side;
        _this.path = path;
        return _this;
    }
    return FTAPath;
}(FTAPayload));
exports.FTAPath = FTAPath;
var FTAFileMode;
(function (FTAFileMode) {
    FTAFileMode["read"] = "read";
    FTAFileMode["write"] = "write";
})(FTAFileMode = exports.FTAFileMode || (exports.FTAFileMode = {}));
var FTABinaryData = /** @class */ (function () {
    function FTABinaryData(msgVersion, sideCode, streamId, data) {
        this.msgVersion = msgVersion;
        this.sideCode = sideCode;
        this.streamId = streamId;
        this.data = data;
    }
    FTABinaryData.prototype.buildMessage = function () {
        var header = Buffer.allocUnsafe(4);
        header.writeUInt8(this.msgVersion, 0);
        header.writeUInt8(this.sideCode, 1);
        header.writeUInt16BE(this.streamId, 2);
        return new Blob([header, this.data]);
    };
    FTABinaryData.buildMessage = function (msgVersion, sideCode, streamId, data) {
        var header = Buffer.allocUnsafe(4);
        header.writeUInt8(msgVersion, 0);
        header.writeUInt8(sideCode, 1);
        header.writeUInt16BE(streamId, 2);
        return new Blob([header, data]);
        //return new FTABinaryData(msgVersion, sideCode, streamId, data).buildMessage();
    };
    FTABinaryData.buildNodeMessage = function (msgVersion, sideCode, streamId, data) {
        var newBuffer = Buffer.allocUnsafe(data.byteLength + 4); //I do not like this
        newBuffer.writeUInt8(msgVersion, 0);
        newBuffer.writeUInt8(sideCode, 1);
        newBuffer.writeUInt16BE(streamId, 2);
        data.copy(newBuffer, 4, 0, data.byteLength);
        return newBuffer;
        //return new FTABinaryData(msgVersion, sideCode, streamId, data).buildMessage();
    };
    FTABinaryData.parseMessage = function (msg) {
        var headerNumber;
        var length;
        var buf;
        var internalOffset = 0;
        if (msg instanceof DataView) {
            headerNumber = msg.getUint32(0);
            length = msg.byteLength;
            buf = msg.buffer;
            internalOffset = msg.byteOffset;
        }
        else {
            headerNumber = msg.readUIntBE(0, 4);
            length = msg.length;
            buf = msg.buffer;
            internalOffset = msg.byteOffset;
        }
        return FTABinaryData.createBinaryData(headerNumber, length, buf, internalOffset);
    };
    FTABinaryData.createBinaryData = function (headerNumber, length, buf, internalOffset) {
        var msgVersion = (headerNumber >> 24) & 0xFF;
        var sideCode = (headerNumber >> 16) & 0xFF;
        var streamId = headerNumber & 0xFFFF;
        var buffer = Buffer.from(buf, internalOffset + 4, length - 4);
        return new FTABinaryData(msgVersion, sideCode, streamId, buffer);
    };
    FTABinaryData.parseBlob = function (blob, callback) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var dv = new DataView(reader.result);
            var header = dv.getUint32(0);
            var length = dv.byteLength;
            var buf = dv.buffer;
            var internalOffset = dv.byteOffset;
            callback(FTABinaryData.createBinaryData(header, length, buf, internalOffset));
        };
        reader.readAsArrayBuffer(blob);
    };
    return FTABinaryData;
}());
exports.FTABinaryData = FTABinaryData;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=FTATypes.js.map