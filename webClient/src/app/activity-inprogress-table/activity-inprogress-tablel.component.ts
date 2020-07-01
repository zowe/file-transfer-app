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
  selector: 'activity-progress-table',
  templateUrl: './activity-inprogress-tablel.component.html',
  styleUrls: [
  // '../../../node_modules/carbon-components/css/carbon-components.min.css',
  './activity-inprogress-table.component.scss',
  '../../styles.scss'
  ],

})
export class ActivityInprogressTableComponent {
  tableModel: TableModel;
  fatActivityList: FTAActivity[] = [];
  config = globals.prod_config;
  copyOfList = [];
  timeInSecnds = "";
  downLoadProgress = 0;
  cancelTrue = false;

  @ViewChild("customItemTemplate")
  protected customItemTemplate: TemplateRef<any>;

  @ViewChild("actionsMenuTemplate")
  public actionsMenuTemplate: TemplateRef<any>;

  @ViewChild("priorityMenuTemplate")
  public priorityMenuTemplate: TemplateRef<any>;
  
  
  @Input() activityList;
  @Output() cancelEventTrigger = new EventEmitter();

  @Output() priorityEventTrigger = new EventEmitter();


  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition, 
    private downloadService:DownloadService,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.VIEWPORT_EVENTS) private viewportEvents: Angular2PluginViewportEvents) {

  }

  ngOnInit() {
    this.tableModel = new TableModel();
    this.fatActivityList = this.activityList;
    this.finalizeDisplayInfo();
  }
  
  finalizeDisplayInfo() {
    var index: any;
    var formattedActivityList = [];

    const inProgressArray = [];
    for(index in this.fatActivityList){
      inProgressArray.push(
        [new TableItem({data:this.fatActivityList[index].fileName,expandedTemplate: this.customItemTemplate, expandedData:this.fatActivityList[index]}), 
          new TableItem({data: this.config.activityIcons[this.fatActivityList[index].activitytype]}),
          new TableItem({data: this.fatActivityList[index].remoteFile}),
          new TableItem({data: this.fatActivityList[index].size}),
          new TableItem({data:  this.fatActivityList[index],template: this.priorityMenuTemplate}),
          new TableItem({data: this.fatActivityList[index].status}),
          new TableItem({data:this.fatActivityList[index] ,template: this.actionsMenuTemplate })
        ]
      );
    }

    this.tableModel.data = inProgressArray;
    this.copyOfList =  [...this.tableModel.data];

    const tableHeader = [
        new TableHeaderItem({data: this.config.tableHeaders[0]}), 
        new TableHeaderItem({data: this.config.tableHeaders[1]}),
        new TableHeaderItem({data: this.config.tableHeaders[2]}),
        new TableHeaderItem({data: this.config.tableHeaders[3]}),
        new TableHeaderItem({data: this.config.tableHeaders[4]}),
        new TableHeaderItem({data: this.config.tableHeaders[5]}),
        new TableHeaderItem({data: this.config.tableHeaders[6]}),
    ];
    this.tableModel.header = tableHeader;
  }

  ngOnChanges(changes) {
    if(changes.activityList != null){
      if(changes.activityList.currentValue != null){
        this.fatActivityList = changes.activityList.currentValue;
        this.cancelTrue = false;
        this.finalizeDisplayInfo();
      }
    }
  }

  simpleSort(index: number, type:string) {
    this.sort(this.tableModel, index);
  }

  sort(model, index: number) {
    if (model.header[index].sorted) {
      // if already sorted flip sorting direction
      model.header[index].ascending = model.header[index].descending;
    }
    model.sort(index);
  }

  searchValueChange(value: string) {
    if(value){
      this.tableModel.data = this.tableModel.data.filter( 
        (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
        item[1].data.toLowerCase().includes(value.toLowerCase())) ;
    }else{
      this.tableModel.data= this.copyOfList;
    } 
  }

  calculateTimeToDownload(){
    let startTime = this.downloadService.startTime;
    let downloadedSize = this.downloadService.donwloadedSize;
    let totalSize = (this.downloadService.totalSize)/(1024 * 512);
    let elapsedTime = (new Date().getTime()) - startTime;
    let chunksPerTime = downloadedSize / elapsedTime;
    let estimatedTotalTime = totalSize / chunksPerTime;
    let timeLeftInSeconds = (estimatedTotalTime - elapsedTime) / 1000;
    let withOneDecimalPlace = Math.round(timeLeftInSeconds * 10) / 10;
    const time = new Date(null);
    time.setSeconds(timeLeftInSeconds);
    this.timeInSecnds =  time.toISOString().substr(11, 8);
    return this.timeInSecnds;
  }

  cancelDownload(event,data){
    event.stopPropagation();
    this.cancelEventTrigger.emit(data);
  }

  priorityChange(data){
    this.findExisitingObject(data, this.fatActivityList).then((index)=> {
      if(index >= 0 && data.status != this.config.statusList[0]){
        if(data.priority == this.config.priority[0]){
            this.fatActivityList[index].priority = this.config.priority[1];
            let highPriorityObject = this.fatActivityList.splice(index,1);
            const inProgressObject = this.fatActivityList.splice(0,1);
            this.fatActivityList.unshift(highPriorityObject[0]);
            this.fatActivityList.unshift(inProgressObject[0]);
            highPriorityObject = highPriorityObject.slice();
            this.priorityEventTrigger.emit(highPriorityObject[0]);
        }else{
          this.fatActivityList[index].priority = this.config.priority[0];
          let lowPriorityObject = this.fatActivityList.splice(index,1);
          this.fatActivityList.push(lowPriorityObject[0]);
          lowPriorityObject = lowPriorityObject.slice();
          this.priorityEventTrigger.emit(lowPriorityObject[0]);
        }
        this.finalizeDisplayInfo();
      }
    });
  }

  findExisitingObject(objectToFind, objectArray){
    const existingObject = objectArray.findIndex(obj => obj.uuid == objectToFind.uuid)
    return Promise.resolve(existingObject);
  }
}

