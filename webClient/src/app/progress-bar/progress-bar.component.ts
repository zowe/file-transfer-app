/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, EventEmitter, Output, Inject, Input,ViewChild,TemplateRef } from '@angular/core';
import { Connection } from '../Connection';
import { FTAActivityService } from '../services/FTAActivity.service';
import { FTAActivity } from '../services/FTAActivity.service';
import { DownloadService } from '../services/Download.service';
import { TableItem, TableHeaderItem, TableModel,TableExpandedRow} from 'carbon-components-angular/table/table.module';

import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { Angular2InjectionTokens,Angular2PluginViewportEvents } from 'pluginlib/inject-resources';
import * as globals from '../../environments/environment';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.html',
  styleUrls: [
  // '../../../node_modules/carbon-components/css/carbon-components.min.css',
  './progress-bar.component.scss',
  '../../styles.scss'
  ],

})
export class ProgressBarComponent {
  timeInSecnds = "";
  downLoadProgress = 0;

  @ViewChild("customItemTemplate")
  protected customItemTemplate: TemplateRef<any>;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition, 
    private downloadService:DownloadService,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.VIEWPORT_EVENTS) private viewportEvents: Angular2PluginViewportEvents) {

  }

  ngOnInit() {
   
  }
  
  getDownloadProgress(){
    let startTime = this.downloadService.startTime;
    let downloadedSize = this.downloadService.donwloadedSize;
    let totalSize = (this.downloadService.totalSize)/(1024 * 512);
    this.downLoadProgress = Math.min(Math.round((downloadedSize / totalSize) * 100), 100);
    return Math.min(Math.round((downloadedSize / (totalSize)) * 100), 100);
  }

}

