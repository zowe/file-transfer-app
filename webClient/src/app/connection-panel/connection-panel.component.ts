import { Component, EventEmitter, Output, Inject} from '@angular/core';
import { Connection } from '../Connection';
import { FTAWebsocketService } from '../services/FTAWebsocket.service';

import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';

@Component({
  selector: 'app-connection-panel',
  templateUrl: './connection-panel.component.html',
  styleUrls: [
  // '../../../node_modules/carbon-components/css/carbon-components.min.css',
  './connection-panel.component.scss',
  '../../styles.scss'
  ],
  providers: [FTAWebsocketService]
})
export class ConnectionPanelComponent {

  @Output() submitted = new EventEmitter<Connection>();

  title = 'app';
  ftaServiceUrl: string;

  protocols: SelectItem[];
  selectedProtocol: SelectItem;

  address = '';
  username = '';
  password = '';

  remoteConnection: Connection;
  connections: Connection[];

  connectionMessages: Message[];

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition) {
    this.ftaServiceUrl = ZoweZLUX.uriBroker.pluginWSUri(this.pluginDefinition.getBasePlugin(), 'fs', '');
  }

  ngOnInit(): void {
    this.connectionMessages = new Array<Message>();
    this.selectedProtocol = { value: 'sftp'};
  }

  passwordInputEnter(): void {
    this.onConnectionDialogOk();
  }

  onConnectionDialogOk(): void {
    const ftaWs: FTAWebsocketService = new FTAWebsocketService();
    const connectionErrorHandler = (err: any) => {
      console.log('FTA error: ' + err);
      this.connectionMessages.pop();
      this.connectionMessages.push({severity: 'error', summary: 'Error', detail: err});
    };
    ftaWs.onError(connectionErrorHandler);
    ftaWs.onRemoteConnect((err: any, connected: boolean) => {
        if (connected) {
          console.log('FTA onTargetConnect ' + err);
          this.remoteConnection = new Connection(this.selectedProtocol.value + '://' + this.address, ftaWs);
          this.submitted.emit(this.remoteConnection);
          // this.connections.push(connection);
          ftaWs.removeErrorListener(connectionErrorHandler);
        } else {
          this.connectionMessages.pop();
          this.connectionMessages.push({severity: 'error', summary: 'Connection Error', detail: err});
        }
    });
    ftaWs.onConnect((err: Error, connected: boolean) => {
        console.log('FTA Connected to the service');
        ftaWs.remoteConnect(this.selectedProtocol.value,
          this.address,
          this.selectedProtocol.value === 'sftp' ? 22 : 21,
          this.username,
          this.password);
    });
    ftaWs.connect(this.ftaServiceUrl);
  }
}
