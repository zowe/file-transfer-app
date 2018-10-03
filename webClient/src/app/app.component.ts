

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { Connection } from './Connection';
//import { ConnectionViewComponent } from './connection-view-component';
import { FTAWebsocketService } from './services/FTAWebsocket.service';

import {SelectItem} from 'primeng/api';
import {Message} from 'primeng/components/common/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
                '../../node_modules/carbon-components/css/carbon-components.min.css',
                '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
                '../../node_modules/primeng/resources/primeng.min.css',
                '../../node_modules/primeng/resources/themes/omega/theme.css',
                './app.component.css'
                ],
  providers: [FTAWebsocketService]
})

export class AppComponent {
  title = 'app';

  ftaServiceUrl: string;

  protocols: SelectItem[] = [

    {label:'SFTP', value: 'sftp'},
    {label:'FTP', value:'ftp'}
  ];
  selectedProtocol: SelectItem = this.protocols[0];
  address: string;
  username: string;
  password: string;
  
  connectionMessages: Message[] = [];

  localConnection: Connection;
  connections: Connection[] = [];

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition) {
    let host = this.document.location.hostname;
    //let port = this.document.location.port;
    //this.ftaServiceUrl = 'ws://'+ host + ':' + port + '/ZLUX/plugins/com.rs.mvd.fileTransferApp/services/fs';
    this.ftaServiceUrl = (window as any).ZoweZLUX.uriBroker.pluginWSUri(this.pluginDefinition.getBasePlugin(), 'fs','');
    console.log('FTA service url: ' + this.ftaServiceUrl);
    var ftaWs: FTAWebsocketService = new FTAWebsocketService();
    ftaWs.onConnect((err: Error, connected: boolean) => {
      console.log('FTA locally connected to the service');
      this.localConnection = new Connection('local://' + host, ftaWs);
    });
    ftaWs.connect(this.ftaServiceUrl);
    
  }

  hideMessages(): void {
    console.log('hideMessages');
    this.connectionMessages = [];
  }

  onConnectionDialogOk(): void {
    var ftaWs: FTAWebsocketService = new FTAWebsocketService();
    var connectionErrorHandler = (err: any) => {
      console.log('FTA error: ' + err);
      this.connectionMessages.pop();
      this.connectionMessages.push({severity: 'error', summary: 'Error', detail: err});
    };
    ftaWs.onError(connectionErrorHandler);
    ftaWs.onRemoteConnect((err: any, connected: boolean) => {
        if (connected) {
          console.log('FTA onTargetConnect ' + err);
          let connection = new Connection(this.selectedProtocol.value + '://' + this.address, ftaWs);
          this.connections.push(connection);
          ftaWs.removeErrorListener(connectionErrorHandler);
        } else {
          this.connectionMessages.pop();
          this.connectionMessages.push({severity: 'error', summary: 'Connection Error', detail: err});
        }
    });
    ftaWs.onConnect((err: Error, connected: boolean) => {
        console.log('FTA Connected to the service');
        ftaWs.remoteConnect(this.selectedProtocol.value, this.address, this.selectedProtocol.value == 'sftp' ? 22 : 21, this.username, this.password);
    });
    ftaWs.connect(this.ftaServiceUrl);
  }

  passwordInputEnter(): void {
    this.onConnectionDialogOk();
  }

  onClose() {
    //not working
    console.log('onClose ' + arguments);
  }

  tabClose(event: Event): void {
    //not working
    console.log('tabClose ' + event);
  }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

