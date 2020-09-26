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
import {ConfigVariables} from '../../shared/configvariable-enum';

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
  activityHistoryStatus = 0;
  progress = 0;
  //input to get activities in progress.
  @Input() objectInProgress;
  // input to get activity update.
  @Input() objectUpdate;

  //cancel event trigger.
  @Output() cancelEventTriggerParent = new EventEmitter();
  //priority event trigger.
  @Output() priorityEventTriggerParent = new EventEmitter();
  
  //array to hold all downloads.
  public fatDownloadActivity: FTAActivity[] = [];
  //array to hold activities in progress.
  public fatDownloadActivityInprogress: FTAActivity[] = [];
  //array to hold cancel download activites.
  public fatDownloadCancel: FTAActivity[] = [];
  //array to hold completed list of downloads.
  public fatDownloadCompleted: FTAActivity[] = [];
  //array to hold upload activity list.
  public fatUploadActivity: FTAActivity[];
  //array to hold transfer activity list.
  public fatTransferActivity: FTAActivity[];
  //global config.
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
    //get the list of history activites saved in user scope.
    const sub = this.ftaactivityService.getData().then((data) => {
      if (data && data.contents) {
        this.fatDownloadCompleted = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadCompleted.concat(data.contents.downloadList.completed))) : [];
        this.fatDownloadCancel = data.contents.downloadList.cancelled ? Array.from(new Set(this.fatDownloadCancel.concat(data.contents.downloadList.cancelled))) : [];
        this.fatDownloadActivity = this.fatDownloadCancel ? this.fatDownloadCancel : [];
        this.fatDownloadActivity = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadActivity.concat(data.contents.downloadList.completed))) : [];
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
     //if user wan's to close the app during a download
     //inprogress download -> cancel state
     //downloadqueue -> cancel state.
     this.finalizeObjectBeforeCloseEvent().then((finalizedList) => {
        this.log.debug("exiting fta saved the activity list");
        if(this.activityHistoryStatus == 0){
          this.ftaactivityService.deleteData();
          this.activityHistoryStatus++;
          this.ftaactivityService.saveActivtiy(finalizedList).then((res)=> {
            this.log.debug("saved");
          });
        }
    }).catch((err) => {
      this.log.debug("error in saving activity list");
    });
  }


  finalizeObjectBeforeCloseEvent(): Promise<any> {
    //get inprogress object.
    this.fatDownloadActivity
    .filter(obj => obj.status === ConfigVariables.statusInprogress)
    .forEach(obj => obj.status = ConfigVariables.statusCancel);
    //get queued object.
    this.fatDownloadActivity
    .filter(obj => obj.status === ConfigVariables.statusQueued)
    .forEach(obj => obj.status = ConfigVariables.statusCancel);
    //return after changing the state to cancel.
    return Promise.resolve(this.fatDownloadActivity);
  }


  ngOnChanges(changes) {
    //capture changes in objectinprogress input.
    if(changes.objectInProgress != null){
      if(changes.objectInProgress.currentValue != null){
        if(changes.objectInProgress.currentValue.status == ConfigVariables.statusQueued){
          this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
          this.fatDownloadActivity.push(changes.objectInProgress.currentValue);
          //remove from the list if exceeds the size of the lsit define in user config.
          this.refresh(ConfigVariables.InProgressTab);
        }else if(changes.objectInProgress.currentValue.status == ConfigVariables.statusInprogress){
          this.findExisitingObject(changes.objectInProgress.currentValue, this.fatDownloadActivityInprogress).then((index)=> {
            if(index >= 0){
              this.fatDownloadActivityInprogress[index].status = ConfigVariables.statusInprogress;
            }else{
              this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
            }
            this.findExisitingObject(changes.objectInProgress.currentValue,this.fatDownloadActivity).then((index)=> {
              if(index >= 0){
                this.fatDownloadActivity[index].status = ConfigVariables.statusInprogress;
              }else{
                this.fatDownloadActivity.push(changes.objectInProgress.currentValue);
              }
            });
            //remove from the list if exceeds the size of the lsit define in user config.
            this.refresh(ConfigVariables.InProgressTab);
          });
        }
      }
    }
    //capture changes in objectinprogress input.
    if(changes.objectUpdate != null){
      if(changes.objectUpdate.currentValue != null){
        this.findExisitingObject(changes.objectUpdate.currentValue,this.fatDownloadActivity).then((index)=> {
          if(changes.objectUpdate.currentValue.status == ConfigVariables.statusCancel){
            this.fatDownloadCancel.push(changes.objectUpdate.currentValue);
            this.refresh(ConfigVariables.CancelTab);
            this.fatDownloadActivityInprogress.shift();
            this.refresh(ConfigVariables.InProgressTab);
          }else if(changes.objectUpdate.currentValue.status == ConfigVariables.statusComplete){
            this.fatDownloadCompleted.push(changes.objectUpdate.currentValue);
            this.refresh(ConfigVariables.CompletedTab);
            this.fatDownloadActivityInprogress.shift();
            this.refresh(ConfigVariables.InProgressTab);
          }else if(changes.objectUpdate.currentValue.status == ConfigVariables.statusQueued){
            changes.objectUpdate.currentValue.status = ConfigVariables.statusCancel;
            this.fatDownloadCancel.push(changes.objectUpdate.currentValue);
            this.refresh(ConfigVariables.CancelTab);
            this.findExisitingObject(changes.objectUpdate.currentValue, this.fatDownloadActivityInprogress).then((index)=> {
              if(index >= 0){
                this.fatDownloadActivityInprogress.splice(index,1);
              }
            });
            this.refresh(ConfigVariables.InProgressTab);
          }
          this.fatDownloadActivity[index] = changes.objectUpdate.currentValue;
         
        })
      }
    }
  }

  //method to refresh the array sizes to maintain the size according to the user config.
  refresh(type) : void {
    const limitofActivityHistory = this.ftaConfig.getActivityHistoryLimit();
    if(type == ConfigVariables.InProgressTab){
      //if larger than the limit size slice the array.
      if(this.fatDownloadActivityInprogress.length > limitofActivityHistory){
        this.fatDownloadActivityInprogress.shift();
      }
      this.fatDownloadActivityInprogress = this.fatDownloadActivityInprogress.slice();
    }else if(type == ConfigVariables.CancelTab){
      //if larger than the limit size slice the array.
      if(this.fatDownloadCancel.length > limitofActivityHistory){
        this.fatDownloadCancel.shift();
      }
      this.fatDownloadCancel = this.fatDownloadCancel.slice();
    }else{
      //if larger than the limit size slice the array.
      if(this.fatDownloadCompleted.length > limitofActivityHistory){
        this.fatDownloadCompleted.shift();
      }
      //does nothing special but will help to fire the ngOnChanges event on components.
      this.fatDownloadCompleted = this.fatDownloadCompleted.slice();
    }
  }

  //get the existing object.
  findExisitingObject(objectToFind, objectArray){
      const existingObject = objectArray.findIndex(obj => obj.uuid == objectToFind.uuid)
      return Promise.resolve(existingObject);
  }

  //get the cancel event.
  captureCancelEvent(data){
    if(data != null){
      this.cancelEventTriggerParent.emit(data);
    }
  }

  //captur the rpriority event change.
  capturePriorityEvent(data){
    if(data != null){
      this.priorityEventTriggerParent.emit(data);
    }
  }
}