let Client = require('ssh2-sftp-client');

export class SFTPConnector {
    sftp: any;
    
    constructor() {
        this.sftp = Client();
        this.connect();
    }

    connect(): void {
        this.sftp.connect({
            host: '10.200.1.33',
            port: '1234',
            username: 'rchowdhary',
            password: 'linuxmint'
        }).then(() => { 
            return this.sftp.list('~');
        }).then(data => {
            console.log('\n\n\n', data, 'data stuff');
        }).catch((err) => {
            console.log(err);
        });
    }
}