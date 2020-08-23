/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { UploaderService } from '../services/Uploader.service';
import { MatSnackBar } from '@angular/material';
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { FTAConfigService } from '../services/FTAConfig.service';
import * as globals from '../../environments/environment';
import { Config } from '../modal/config';
import { ConfigVariables } from '../../shared/configvariable-enum';

@Component({
  selector: 'config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: [
    // '../../../node_modules/carbon-components/css/carbon-components.min.css',
    './config-panel.component.scss',
    '../../styles.scss'
  ]
})
export class ConfigPanelComponent {

  public config = globals.prod_config;
  objToSubmit: Config = Config.initEmpty();
  model: Config = Config.initEmpty();


  ngOnInit(): void {
  }

  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();

  

  constructor(private _snackbar: MatSnackBar
  , @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger
  , @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition
  , private ftaConfigService:FTAConfigService
  ) { }

  close(): void {
    this.onClose.emit();
  }

  fetchConfigAfterSaving(){
    this.ftaConfigService.getData();
  }

  onSubmit() {
    this.objToSubmit = JSON.parse(JSON.stringify(this.model));
    this.ftaConfigService.saveData(this.objToSubmit)
      .then(res => {
        this.sendNotification("Config Service Notification", "Updated User Config for the File Transfer App");
        this.close();
        this.fetchConfigAfterSaving();
      })
			.catch(error => {
        this.sendNotification("Error in Saving Config", error);
      });

  }

  sendNotification(title: string, message: string): number {
    const pluginId = this.pluginDefinition.getBasePlugin().getIdentifier();
    // We can specify a different styleClass to theme the notification UI i.e. [...] message, 1, pluginId, "org_zowe_zlux_editor_snackbar"
    let notification = ZoweZLUX.notificationManager.createNotification(title, message, 1, pluginId);
    return ZoweZLUX.notificationManager.notify(notification);
  }
}
