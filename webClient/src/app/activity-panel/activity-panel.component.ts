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

  simpleModel ;
  close = false;
  no = 0;
  progress = 0;
  @Input() objectInProgress;
  @Input() objectUpdate;
  public fatDownloadActivity: FTAActivity[] = [];
  public fatDownloadActivityInprogress: FTAActivity[] = [];
  public fatDownloadCancel: FTAActivity[] = [];
  public fatDownloadCompleted: FTAActivity[] = [];
  public fatUploadActivity: FTAActivity[];
  public fatTransferActivity: FTAActivity[];
  public config = globals.prod_config;
  donwloadActivities = [];
  completeDownload: TableModel;
  cancelDownload: TableModel;
  inProgressDownload: TableModel;
  timeInSecnds:any;

  inProgressCopyData = [];
  complteCopyData = [];
  cancelCopyData = [];


  @ViewChild("customItemTemplate")
  protected customItemTemplate: TemplateRef<any>;

  @ViewChild("actionsMenuTemplate")
  public actionsMenuTemplate: TemplateRef<any>;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition, 
    private ftaactivityService:FTAActivityService,
    private downloadService:DownloadService,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.VIEWPORT_EVENTS) private viewportEvents: Angular2PluginViewportEvents) {
    this.ftaactivityService.onInit();
  }

  ngOnInit(): void {

    this.completeDownload = new TableModel();
    this.cancelDownload = new TableModel();
    this.inProgressDownload = new TableModel();
    this.timeInSecnds = "";
    
    const sub = this.ftaactivityService.getData().then((data) => {
      if (data && data.contents) {
        // this.fatDownloadActivity = data.contents.download ? Array.from(new Set(this.fatDownloadActivity.concat(data.contents.download))) : [];
        this.fatDownloadCompleted = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadCompleted.concat(data.contents.downloadList.completed))) : [];
        this.fatDownloadCancel = data.contents.downloadList.cancelled ? Array.from(new Set(this.fatDownloadCancel.concat(data.contents.downloadList.cancelled))) : [];
        this.fatDownloadActivity = this.fatDownloadCancel ? this.fatDownloadCancel : [];
        this.fatDownloadActivity = data.contents.downloadList.completed ? Array.from(new Set(this.fatDownloadActivity.concat(data.contents.downloadList.completed))) : [];
        // this.fatUploadActivity = data.contents.upload ? Array.from(new Set(this.fatUploadActivity.concat(data.contents.upload))) : [];
        // this.fatTransferActivity = data.contents.transfer ? Array.from(new Set(this.fatTransferActivity.concat(data.contents.transfer))) : [];
        this.finalizeDisplayInfo().then((res) => {
          this.donwloadActivities =  res;
        });
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

  getDownloadProgress(){
    let startTime = this.downloadService.startTime;
    let downloadedSize = this.downloadService.donwloadedSize;
    let totalSize = (this.downloadService.totalSize)/(1024 * 512);
    this.calculateTimeToDownload(startTime, downloadedSize,totalSize );
    this.progress = Math.min(Math.round((downloadedSize / totalSize) * 100), 100);
    return Math.min(Math.round((downloadedSize / (totalSize)) * 100), 100);
  }

  calculateTimeToDownload(startTime, downloaddSize , totalSize){
    let elapsedTime = (new Date().getTime()) - startTime;
    let chunksPerTime = downloaddSize / elapsedTime;
    let estimatedTotalTime = totalSize / chunksPerTime;
    let timeLeftInSeconds = (estimatedTotalTime - elapsedTime) / 1000;
    let withOneDecimalPlace = Math.round(timeLeftInSeconds * 10) / 10;
    const time = new Date(null);
    time.setSeconds(timeLeftInSeconds);
    this.timeInSecnds =  time.toISOString().substr(11, 8);
  }

  sort(model, index: number) {
    if (model.header[index].sorted) {
      // if already sorted flip sorting direction
      model.header[index].ascending = model.header[index].descending;
    }
    model.sort(index);
  }

  simpleSort(index: number, type:string) {
    if(type == "cancel"){
      this.sort(this.cancelDownload, index);
    }else if(type == "complete"){
      this.sort(this.completeDownload, index);
    }
  }

  cancelDownloadEvent(event){
    console.log(event);
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

  finalizeDisplayInfo(): Promise<any> {
    var index: any;
    var formattedActivityList = [];
    //shift item from queue is the limit exceeds
    if(this.fatDownloadCompleted.length > this.config.limitofActivityHistory){
      this.fatDownloadCompleted.shift();
    }
    if(this.fatDownloadCancel.length > this.config.limitofActivityHistory){
      this.fatDownloadCancel.shift();
    }

    if(this.fatDownloadActivityInprogress.length > this.config.limitofActivityHistory){
      this.fatDownloadActivityInprogress.shift();
    }

    const completedArray = [];
    const cancelArray = [];
    const inProgressArray = [];
    for (index in this.fatDownloadCompleted){
      completedArray.push(
        [ new TableItem({data:this.fatDownloadCompleted[index].fileName}), 
          new TableItem({data: this.config.activityIcons[this.fatDownloadCompleted[index].activitytype]}),
          new TableItem({data: this.fatDownloadCompleted[index].remoteFile}),
          new TableItem({data: this.fatDownloadCompleted[index].size}),
          new TableItem({data: "Normal"})
        ]
      );
    }
    for(index in this.fatDownloadCancel){
      cancelArray.push(
        [new TableItem({data:this.fatDownloadCancel[index].fileName}), 
          new TableItem({data: this.config.activityIcons[this.fatDownloadCancel[index].activitytype]}),
          new TableItem({data: this.fatDownloadCancel[index].remoteFile}),
          new TableItem({data: this.fatDownloadCancel[index].size}),
          new TableItem({data: "Normal"}),
          new TableItem({ data: {}, template: this.actionsMenuTemplate })
        ]
      );
    }
    for(index in this.fatDownloadActivityInprogress){
      inProgressArray.push(
        [new TableItem({data:this.fatDownloadActivityInprogress[index].fileName,expandedTemplate: this.customItemTemplate, expandedData:this.fatDownloadActivityInprogress[index] }), 
          new TableItem({data: this.config.activityIcons[this.fatDownloadActivityInprogress[index].activitytype]}),
          new TableItem({data: this.fatDownloadActivityInprogress[index].remoteFile}),
          new TableItem({data: this.fatDownloadActivityInprogress[index].size}),
          new TableItem({data: "Normal"}),
          new TableItem({ data: {}, template: this.actionsMenuTemplate })
        ]
      );
    }

    this.completeDownload.data = completedArray;
    this.complteCopyData =  [...this.completeDownload.data];
    this.cancelDownload.data = cancelArray;
    this.cancelCopyData =  [...this.cancelDownload.data];
    this.inProgressDownload.data = inProgressArray;
    this.inProgressCopyData =  [...this.inProgressDownload.data];

    const header = [
        new TableHeaderItem({data: "Server Local file"}), 
        new TableHeaderItem({data: "Direction" }),
        new TableHeaderItem({data: "Remote file"}),
        new TableHeaderItem({data: "Size"}),
        new TableHeaderItem({data: "Priority"}),
        new TableHeaderItem({data: "Actions"}),
    ];
    this.completeDownload.header = header;
    this.cancelDownload.header = header;
    this.inProgressDownload.header = header;
    this.simpleModel = this.completeDownload;
    return Promise.resolve(formattedActivityList);
  }

  ngOnChanges(changes) {
    if(changes.objectInProgress != null){
      if(changes.objectInProgress.currentValue != null){
        if(changes.objectInProgress.currentValue.status == this.config.statusList[3]){
          this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
          this.finalizeDisplayInfo();

        }else if(changes.objectInProgress.currentValue.status == this.config.statusList[0]){
          this.findExisitingObject(changes.objectInProgress.currentValue, this.fatDownloadActivityInprogress).then((index)=> {
            if(index >= 0){
              this.fatDownloadActivityInprogress[index].status = this.config.statusList[0];
            }else{
              this.fatDownloadActivityInprogress.push(changes.objectInProgress.currentValue);
            }
            this.fatDownloadActivity.push(changes.objectInProgress.currentValue);
            this.finalizeDisplayInfo();
          });
        }
      }
    }
    if(changes.objectUpdate != null){
      if(changes.objectUpdate.currentValue != null){
        this.findExisitingObject(changes.objectUpdate.currentValue,this.fatDownloadActivity).then((index)=> {
          if(changes.objectUpdate.currentValue.status == this.config.statusList[2]){
            this.fatDownloadCancel.push(changes.objectUpdate.currentValue);
          }else if(changes.objectUpdate.currentValue.status == this.config.statusList[1]){
            this.fatDownloadCompleted.push(changes.objectUpdate.currentValue);
          }
          this.fatDownloadActivityInprogress.shift();
          this.fatDownloadActivity[index] = changes.objectUpdate.currentValue;
          this.finalizeDisplayInfo();
        })
      }
    }
  }

  findExisitingObject(objectToFind, objectArray){
      const existingObject = objectArray.findIndex(obj => obj.uuid == objectToFind.uuid)
      return Promise.resolve(existingObject);
  }

  selected(event){
    
  }

  searchValueChange(value: string, type: string) {
    if(type == "complete"){
      if(value){
        this.completeDownload.data = this.completeDownload.data.filter( 
          (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
          item[1].data.toLowerCase().includes(value.toLowerCase())) ;
      }
      else{
        this.completeDownload.data= this.complteCopyData;
      } 
    }else if(type == "inprogress"){
      if(value){
        this.inProgressDownload.data = this.inProgressDownload.data.filter( 
          (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
          item[1].data.toLowerCase().includes(value.toLowerCase())) ;
      }
      else{
        this.inProgressDownload.data= this.inProgressCopyData;
      } 
    }else{
      if(value){
        this.cancelDownload.data = this.cancelDownload.data.filter( 
          (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
          item[1].data.toLowerCase().includes(value.toLowerCase())) ;
      }
      else{
        this.cancelDownload.data= this.cancelCopyData;
      } 
    }

  
  } 
}

