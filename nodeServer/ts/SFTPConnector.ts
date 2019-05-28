/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

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
            return this.sftp.list('.');
        }).then(data => {
            console.log('\n\n\n', data, 'data stuff');
        }).catch((err) => {
            console.log(err);
        });
    }
}