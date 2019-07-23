

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'; // DEPRECATED
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { Connection } from './Connection';
import { FTAWebsocketService } from './services/FTAWebsocket.service';
import { FTASide } from '../../../common/FTATypes';

import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';

import { ModalService } from 'carbon-components-angular/modal/modal.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
                // '../../node_modules/carbon-components/css/carbon-components.min.css',
                '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
                // '../../node_modules/primeng/resources/primeng.min.css',
                // '../../node_modules/primeng/resources/themes/omega/theme.css',
                '../styles.scss',
                './app.component.scss'
                ],
  providers: [FTAWebsocketService]
})

export class AppComponent {

  
private showMenu:boolean;
  title = 'app';

  get sideLocal(): FTASide {
    return FTASide.LOCAL;
  }
  get sideRemote(): FTASide {
      return FTASide.REMOTE;
  }

  ftaServiceUrl: string;

  protocols: SelectItem[] = [
    {label: 'SFTP', value: 'sftp'},
    {label: 'FTP', value: 'ftp'}
  ];
  selectedProtocol: SelectItem = this.protocols[0];
  address: string;
  username: string;
  password: string;

  connectionMessages: Message[] = [];

  // Local and remote are from the perspective of the first mainframe you connect to.
  // From the perspective of the user's browser both connections are remote.
  localConnection: Connection;
  remoteConnection: Connection;
  connections: Connection[] = [];
  credentialsSubmitted: boolean;

  response: any;

  constructor(
    @Inject(DOCUMENT)
    private document: any,
    @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION)
    private pluginDefinition: ZLUX.ContainerPluginDefinition,
    public modalService: ModalService
    ) {

  

    const host = this.document.location.hostname;
    this.ftaServiceUrl = (window as any).ZoweZLUX.uriBroker.pluginWSUri(this.pluginDefinition.getBasePlugin(), 'fs', '');

    this.credentialsSubmitted = false;

    console.log('FTA service url: ' + this.ftaServiceUrl);

    const ftaWs: FTAWebsocketService = new FTAWebsocketService();
    ftaWs.onConnect((err: Error, connected: boolean) => {
      console.log('FTA locally connected to the service');
      this.localConnection = new Connection('local://' + host, ftaWs);
    });
    ftaWs.connect(this.ftaServiceUrl);
  }

  onCredentialsSubmitted(connection: Connection): void {
    console.log('Credentials Submitted');
    this.credentialsSubmitted = true;
    this.remoteConnection = connection;
  }

 toggleMenu() {
    var connect = document.getElementById("connection-panel");
    var expand = <HTMLButtonElement>document.getElementById("expand");
  

    if (connect.style.display === "none") {
      connect.style.display = "block";
      expand.className = "toggle-menu contract-menu";

    } else {
      connect.style.display = "none";
      expand.className = "toggle-menu expand-menu";
;
     
    }
  }




 
}

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
