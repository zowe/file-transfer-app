"use strict";
exports.__esModule = true;
var Client = require('ssh2-sftp-client');
var SFTPConnector = /** @class */ (function () {
    function SFTPConnector() {
        this.sftp = Client();
        this.connect();
    }
    SFTPConnector.prototype.connect = function () {
        var _this = this;
        this.sftp.connect({
            host: '10.200.1.33',
            port: '1234',
            username: 'rchowdhary',
            password: 'linuxmint'
        }).then(function () {
            return _this.sftp.list('.');
        }).then(function (data) {
            console.log('\n\n\n', data, 'data stuff');
        })["catch"](function (err) {
            console.log(err);
        });
    };
    return SFTPConnector;
}());
exports.SFTPConnector = SFTPConnector;
//# sourceMappingURL=SFTPConnector.js.map