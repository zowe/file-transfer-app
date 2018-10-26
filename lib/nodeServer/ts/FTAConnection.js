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
var events_1 = require("events");
var FTAConnectionEvents;
(function (FTAConnectionEvents) {
    FTAConnectionEvents["ERROR"] = "error";
    FTAConnectionEvents["CONNECT"] = "connect";
})(FTAConnectionEvents = exports.FTAConnectionEvents || (exports.FTAConnectionEvents = {}));
var FTAConnection = /** @class */ (function (_super) {
    __extends(FTAConnection, _super);
    function FTAConnection(side) {
        var _this = _super.call(this) || this;
        _this.streamMap = new Map();
        _this.side = side;
        return _this;
    }
    FTAConnection.prototype.getStream = function (streamId) {
        return this.streamMap.get(streamId);
    };
    FTAConnection.prototype.addStream = function (stream, endHandler) {
        var _this = this;
        var streamId = this.streamMap.size;
        this.streamMap.set(streamId, stream);
        if (endHandler) {
            stream.___FTAConnectionClose = function (err) {
                endHandler(err, streamId);
            };
        }
        var closeHandler = function () {
            _this.removeStream(streamId);
            console.log(_this.toString() + ': stream closed ' + streamId);
        };
        stream.on('close', closeHandler);
        stream.on('finish', closeHandler);
        return streamId;
    };
    FTAConnection.prototype.hasStream = function (streamId) {
        return this.streamMap.has(streamId);
    };
    FTAConnection.prototype.removeStream = function (streamId) {
        return this.streamMap["delete"](streamId);
    };
    FTAConnection.prototype.closeStream = function (streamId, err) {
        var stream = this.getStream(streamId);
        this.closeStreamInternal(stream, err);
        return this.removeStream(streamId);
    };
    FTAConnection.prototype.closeStreamInternal = function (stream, err) {
        //IncomingMessage and ClientRequest has no close method, end instead
        if (stream) {
            if (stream.close) {
                stream.close();
            }
            else if (stream.end) {
                stream.end();
            }
            else {
                console.error('unknown stream type ' + stream);
            }
            if (stream.___FTAConnectionClose) {
                stream.___FTAConnectionClose(err);
            }
        }
        else {
            console.error('stream not defined');
        }
    };
    FTAConnection.prototype.writeToStream = function (writeStream, data, handler) {
        if (writeStream) {
            try {
                writeStream.write(data, handler);
            }
            catch (err) {
                return handler(err);
            }
        }
        else {
            handler('stream is missing');
        }
    };
    FTAConnection.prototype.readStreamAddHandler = function (streamId, readStream, dataHandler, end) {
        var _this = this;
        if (dataHandler) {
            readStream.on('data', function (chunk) {
                dataHandler(null, streamId, chunk);
            });
        }
        readStream.on('end', function () {
            _this.closeStreamInternal(readStream);
            _this.removeStream(streamId);
            if (end) {
                end(null, streamId);
            }
        });
    };
    FTAConnection.prototype.disconnect = function () {
        var _this = this;
        this.streamMap.forEach(function (stream, streamId, map) {
            _this.closeStreamInternal(stream);
        });
        this.streamMap.clear();
    };
    return FTAConnection;
}(events_1.EventEmitter));
exports.FTAConnection = FTAConnection;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=FTAConnection.js.map