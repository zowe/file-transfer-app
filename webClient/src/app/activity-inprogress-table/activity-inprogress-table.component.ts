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
import {ConfigVariables} from '../../shared/configvariable-enum';

@Component({
  selector: 'activity-progress-table',
  templateUrl: './activity-inprogress-table.component.html',
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
  downloadInProgress: boolean = false;


  //set of elements which holds download speed, progress bar, etc-.
  @ViewChild("customItemTemplate")
  protected customItemTemplate: TemplateRef<any>;

  //actiion items ex:- cancel download template.
  @ViewChild("actionsMenuTemplate")
  public actionsMenuTemplate: TemplateRef<any>;

  //template ref to hold priority change buttons.
  @ViewChild("priorityMenuTemplate")
  public priorityMenuTemplate: TemplateRef<any>;
  
  // current active list of downloads.
  @Input() activityList;

  //event trigger which fires download cancel event.
  @Output() cancelEventTrigger = new EventEmitter();

  //event trigger which will push priority event change.
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
  
  //finalize the display of the table.
  finalizeDisplayInfo() {
    if(this.tableModel !=  null){
      this.downloadInProgress = true;
      var index: any;
      var formattedActivityList = [];
      const inProgressArray = [];
      //populating the inprogress activity list.
      for(index in this.fatActivityList){
        inProgressArray.push(
          [new TableItem({data:this.fatActivityList[index].fileName,expandedTemplate: this.customItemTemplate, expandedData:this.fatActivityList[index]}), 
            new TableItem({data: ConfigVariables[this.fatActivityList[index].activitytype]}),
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
          new TableHeaderItem({data: ConfigVariables.TableHeader1}), 
          new TableHeaderItem({data: ConfigVariables.TableHeader2}),
          new TableHeaderItem({data: ConfigVariables.TableHeader3}),
          new TableHeaderItem({data: ConfigVariables.TableHeader4}),
          new TableHeaderItem({data: ConfigVariables.TableHeader5}),
          new TableHeaderItem({data: ConfigVariables.TableHeader6}),
          new TableHeaderItem({data: ConfigVariables.TableHeader7}),
      ];
      this.tableModel.header = tableHeader;
    }else{
      this.downloadInProgress = false;
    }
  }

  //listenting for changes in activity list
  //for an example new donwload addition download cancellation.
  ngOnChanges(changes) {
    if(changes.activityList != null){
      if(changes.activityList.currentValue != null){
        this.fatActivityList = changes.activityList.currentValue;
        this.finalizeDisplayInfo();
      }
    }
  }

  //sort function for the data table.
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

  //search the data table.
  searchValueChange(value: string) {
    if(value){
      this.tableModel.data = this.tableModel.data.filter( 
        (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
        item[1].data.toLowerCase().includes(value.toLowerCase())) ;
    }else{
      this.tableModel.data= this.copyOfList;
    } 
  }

  //calculate time left to download.
  //todo :- coming up with a zss endpoint to grab the
  //left size to be donwloaded and calculate the time based on it.
  calculateTimeToDownload(){
    let startTime = this.downloadService.startTime;
    let downloadedSize = this.downloadService.downloadedSize;
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

  //fire the event to cancel a download.
  cancelDownload(event,data){
    event.stopPropagation();
    this.cancelEventTrigger.emit(data);
  }

  //function to handle priority event changes.
  priorityChange(data){
    this.findExisitingObject(data, this.fatActivityList).then((index)=> {
      if(index >= 0 && data.status != ConfigVariables.statusInprogress){
        if(data.priority == ConfigVariables.LowPriority){
            //set the priority high.
            this.fatActivityList[index].priority = ConfigVariables.HighPriority;
            //splice the object and take it out from the current activity list array.
            let highPriorityObject = this.fatActivityList.splice(index,1);
            //splice out the current inprogress array.
            const inProgressObject = this.fatActivityList.splice(0,1);
            //add the high priority object back first.
            this.fatActivityList.unshift(highPriorityObject[0]);
            //add the inproress object next. Since it is already inprogress it should be the first in the list.
            this.fatActivityList.unshift(inProgressObject[0]);
            //does nothing special but will help to fire the ngOnChanges event on components.
            highPriorityObject = highPriorityObject.slice();
            //emit the priority object.This will make sure to fire the ngOnChanges 
            //event in browser panel component which handles the download directly.
            this.priorityEventTrigger.emit(highPriorityObject[0]);
        }else{
          //set the priority low.
          this.fatActivityList[index].priority = ConfigVariables.LowPriority;
          //splice the object and take it out from the current activity list array.
          let lowPriorityObject = this.fatActivityList.splice(index,1);
          //push the object in to the last of the list.
          this.fatActivityList.push(lowPriorityObject[0]);
          //does nothing special but will help to fire the ngOnChanges event on components.
          lowPriorityObject = lowPriorityObject.slice();
          //emit the priority object.This will make sure to fire the ngOnChanges 
          //event in browser panel component which handles the download directly.
          this.priorityEventTrigger.emit(lowPriorityObject[0]);
        }
        //refresh the data table.
        this.finalizeDisplayInfo();
      }
    });
  }

  //when the priority change event fires get the object which priority has changed.
  findExisitingObject(objectToFind, objectArray){
    const existingObject = objectArray.findIndex(obj => obj.uuid == objectToFind.uuid)
    return Promise.resolve(existingObject);
  }
}