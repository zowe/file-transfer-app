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
import { FTAConfigService } from '../services/FTAConfig.service';
import { DownloadService } from '../services/Download.service';
import { TableItem, TableHeaderItem, TableModel,TableExpandedRow} from 'carbon-components-angular/table/table.module';

import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { Angular2InjectionTokens,Angular2PluginViewportEvents } from 'pluginlib/inject-resources';
import * as globals from '../../environments/environment';

@Component({
  selector: 'activity-panel',
  templateUrl: './/activity-panel.component.html',
  styleUrls: [
  // '../../../node_modules/carbon-components/css/carbon-components.min.css',
  './activity-panel.component.scss',
  '../../styles.scss'
  ],
  providers: [FTAActivityService]
})
export class ActivityPanelComponent {

  close = false;
  no = 0;
  progress = 0;
  @Input() objectInProgress;
  @Input() objectUpdate;

  @Output() cancelEventTriggerParent = new EventEmitter();
  @Output() priorityEventTriggerParent = new EventEmitter();
  

  public fatDownloadActivity: FTAActivity[] = [];
  public fatDownloadActivityInprogress: FTAActivity[] = [];
  public fatDownloadCancel: FTAActivity[] = [];
  public fatDownloadCompleted: FTAActivity[] = [];
  public fatUploadActivity: FTAActivity[];
  public fatTransferActivity: FTAActivity[];
  public config = globals.prod_config;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition, 
    private ftaactivityService:FTAActivityService,
    private downloadService:DownloadService,
    private ftaConfig:FTAConfigService,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.VIEWPORT_EVENTS) private viewportEvents: Angular2PluginViewportEvents) {
    this.ftaactivityService.onInit();
  }

  ngOnInit(): void {
    const sub = this.ftaactivityService.getData().then((data) => {
      if (data && data.contents) {
        // this.fatDownloadActivity = data.contents.download ? Array.from(new Set(this.fatDownloadActivity.concat(data.contents.download))) : [];
        this.fatDownloadCompleted = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadCompleted.concat(data.contents.downloadList.completed))) : [];
        this.fatDownloadCancel = data.contents.downloadList.cancelled ? Array.from(new Set(this.fatDownloadCancel.concat(data.contents.downloadList.cancelled))) : [];
        this.fatDownloadActivity = this.fatDownloadCancel ? this.fatDownloadCancel : [];
        this.fatDownloadActivity = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadActivity.concat(data.contents.downloadList.completed))) : [];
        // this.fatUploadActivity = data.contents.upload ? Array.from(new Set(this.fatUploadActivity.concat(data.contents.upload))) : [];
        // this.fatTransferActivity = data.contents.transfer ? Array.from(new Set(this.fatTransferActivity.concat(data.contents.transfer))) : [];
      };
    });

    this.viewportEvents.registerCloseHandler(():Promise<void>=> {
      return new Promise((resolve,reject)=> {
        this.ngOnDestroy();
        resolve();
      });
    });
  }

   ngOnDestroy(): void {
     this.finalizeObjectBeforeCloseEvent().then((finalizedList) => {
        this.log.debug("exiting fta saved the activity list");
        if(this.no == 0){
          this.ftaactivityService.deleteData();
          this.no++;
          this.ftaactivityService.saveActivtiy(finalizedList).then((res)=> {
            this.log.debug("saved");
            console.log("saved");
          });
        }
    }).catch((err) => {
      this.log.debug("error in saving activity list");
    });
  }

  saveActivities(){
    
  }

  finalizeObjectBeforeCloseEvent(): Promise<any> {
    const inProgressList = this.fatDownloadActivity.filter(obj => obj.status === this.config.statusList[0]);
    for(var inProgress in inProgressList){
      const indexOfObject = this.fatDownloadActivity.indexOf(inProgressList[inProgress]);
      inProgressList[inProgress].status = this.config.statusList[2];
      this.fatDownloadActivityInprogress.splice(indexOfObject, 1);
      this.fatDownloadCancel.push(inProgressList[inProgress]);
      this.fatDownloadActivity[indexOfObject] = inProgressList[inProgress];
    }
    return Promise.resolve(this.fatDownloadActivity);
  }


  ngOnChanges(changes) {
    if(changes.objectInProgress != null){
      if(changes.objectInProgress.currentValue != null){
        if(changes.objectInProgress.currentValue.status == this.config.statusList[3]){
          this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
          this.refresh(this.config.tabTypes[0]);
        }else if(changes.objectInProgress.currentValue.status == this.config.statusList[0]){
          this.findExisitingObject(changes.objectInProgress.currentValue, this.fatDownloadActivityInprogress).then((index)=> {
            if(index >= 0){
              this.fatDownloadActivityInprogress[index].status = this.config.statusList[0];
            }else{
              this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
            }
            this.refresh(this.config.tabTypes[0]);
            this.fatDownloadActivity.push(changes.objectInProgress.currentValue);
          });
        }
      }
    }
    if(changes.objectUpdate != null){
      if(changes.objectUpdate.currentValue != null){
        this.findExisitingObject(changes.objectUpdate.currentValue,this.fatDownloadActivity).then((index)=> {
          if(changes.objectUpdate.currentValue.status == this.config.statusList[2]){
            this.fatDownloadCancel.push(changes.objectUpdate.currentValue);
            this.refresh(this.config.tabTypes[1]);
            this.fatDownloadActivityInprogress.shift();
            this.refresh(this.config.tabTypes[0]);
          }else if(changes.objectUpdate.currentValue.status == this.config.statusList[1]){
            this.fatDownloadCompleted.push(changes.objectUpdate.currentValue);
            this.refresh(this.config.tabTypes[2]);
            this.fatDownloadActivityInprogress.shift();
            this.refresh(this.config.tabTypes[0]);
          }else if(changes.objectUpdate.currentValue.status == this.config.statusList[3]){
            changes.objectUpdate.currentValue.status = this.config.statusList[2];
            this.fatDownloadCancel.push(changes.objectUpdate.currentValue);
            this.refresh(this.config.tabTypes[1]);
            this.findExisitingObject(changes.objectUpdate.currentValue, this.fatDownloadActivityInprogress).then((index)=> {
              if(index >= 0){
                this.fatDownloadActivityInprogress.splice(index,1);
              }
            });
            this.refresh(this.config.tabTypes[0]);
          }
          this.fatDownloadActivity[index] = changes.objectUpdate.currentValue;
         
        })
      }
    }
  }

  refresh(type) : void {
    const limitofActivityHistory = this.ftaConfig.getActivityHistoryLimit();
    if(type == this.config.tabTypes[0]){
      if(this.fatDownloadActivityInprogress.length > limitofActivityHistory){
        this.fatDownloadActivityInprogress.shift();
      }
      this.fatDownloadActivityInprogress = this.fatDownloadActivityInprogress.slice();
    }else if(type == this.config.tabTypes[1]){
      if(this.fatDownloadCancel.length > limitofActivityHistory){
        this.fatDownloadCancel.shift();
      }
      this.fatDownloadCancel = this.fatDownloadCancel.slice();
    }else{
      if(this.fatDownloadCompleted.length > limitofActivityHistory){
        this.fatDownloadCompleted.shift();
      }
      this.fatDownloadCompleted = this.fatDownloadCompleted.slice();
    }
  }

  findExisitingObject(objectToFind, objectArray){
      const existingObject = objectArray.findIndex(obj => obj.uuid == objectToFind.uuid)
      return Promise.resolve(existingObject);
  }

  captureCancelEvent(data){
    if(data != null){
      this.cancelEventTriggerParent.emit(data);
    }
  }

  capturePriorityEvent(data){
    if(data != null){
      this.priorityEventTriggerParent.emit(data);
    }
  }
}