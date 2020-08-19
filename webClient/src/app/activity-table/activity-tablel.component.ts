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
  selector: 'activity-table',
  templateUrl: './activity-tablel.component.html',
  styleUrls: [
  // '../../../node_modules/carbon-components/css/carbon-components.min.css',
  './activity-table.component.scss',
  '../../styles.scss'
  ],

})
export class ActivityTableComponent {
  tableModel: TableModel;
  fatActivityList: FTAActivity[] = [];
  config = globals.prod_config;
  copyOfList = [];

  // current active list of downloads.
  @Input() activityList;

  ngOnInit() {
    this.tableModel = new TableModel();
    this.fatActivityList = this.activityList;
    this.finalizeDisplayInfo();
  }
  
  //finalize the display of the table.
  finalizeDisplayInfo() {
    var index: any;
    var formattedActivityList = [];

    const completedArray = [];
    const cancelArray = [];
    const inProgressArray = [];
    //populating the inprogress activity list.
    for (index in this.fatActivityList){
      completedArray.push(
        [ new TableItem({data:this.fatActivityList[index].fileName}), 
          new TableItem({data: this.config.activityIcons[this.fatActivityList[index].activitytype]}),
          new TableItem({data: this.fatActivityList[index].remoteFile}),
          new TableItem({data: this.fatActivityList[index].size}),
          new TableItem({data: this.config.priority[0]})
        ]
      );
    }

    this.tableModel.data = completedArray;
    this.copyOfList =  [...this.tableModel.data];

    const tableHeader = [
        new TableHeaderItem({data: this.config.tableHeaders[0]}), 
        new TableHeaderItem({data: this.config.tableHeaders[1]}),
        new TableHeaderItem({data: this.config.tableHeaders[2]}),
        new TableHeaderItem({data: this.config.tableHeaders[3]}),
        new TableHeaderItem({data: this.config.tableHeaders[4]})
    ];
    this.tableModel.header = tableHeader;
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

  //sorting the data table.
  simpleSort(index: number) {
    this.sort(index);
  }

  sort(index: number) {
    if (this.tableModel.header[index].sorted) {
      // if already sorted flip sorting direction
      this.tableModel.header[index].ascending = this.tableModel.header[index].descending;
    }
    this.tableModel.sort(index);
  }

  //searching the data table.
  searchValueChange(value: string) {
    if(value){
      this.tableModel.data = this.tableModel.data.filter( 
        (item) => item[0].data.toLowerCase().includes(value.toLowerCase()) || 
        item[1].data.toLowerCase().includes(value.toLowerCase())) ;
    }
    else{
      this.tableModel.data= this.copyOfList;
    } 
  }

}

