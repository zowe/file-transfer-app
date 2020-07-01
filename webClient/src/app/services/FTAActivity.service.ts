// /*
//   This program and the accompanying materials are
//   made available under the terms of the Eclipse Public License v2.0 which accompanies
//   this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
//   SPDX-License-Identifier: EPL-2.0
//   Copyright Contributors to the Zowe Project.
// */
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject } from '@angular/core';
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { of } from 'rxjs';
import * as globals from '../../environments/environment';

@Injectable()
export class FTAActivityService {
  private scope: string = 'user';
  private resourcePath: string = 'ui/ftaactivity';
  private basePlugin: ZLUX.Plugin;

  private resourceName: string;
  private uri: string;
  public fatDownloadActivity: FTAActivity[];
  public fatDownloadActivityCancelled: FTAActivity[];
  public fatDownloadActivityCompleted: FTAActivity[];
  public fatUploadActivity: FTAActivity[];
  public fatTransferActivity: FTAActivity[];
  private initFTAActivity:boolean; 
  private type:string;
  private limitofActivityHistory:number;
  public config = globals.prod_config;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition
  , @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger
  , private http: Http) {}

  onInit() {
    this.limitofActivityHistory = 10;
    this.basePlugin = this.pluginDefinition.getBasePlugin();
    this.resourceName = `activity.json`;
    this.uri = ZoweZLUX.uriBroker.pluginConfigForScopeUri(this.basePlugin, this.scope, this.resourcePath, this.resourceName);
    this.fatUploadActivity = [];
    this.fatDownloadActivity = [];
    this.fatDownloadActivityCompleted = [];
    this.fatDownloadActivityCancelled = [];
    this.fatTransferActivity = [];
  }

  public getData():Promise<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(this.uri, options)
      .toPromise()
      .then(res => res.json())
      .catch((err => {
        this.log.debug("error retreiving past data "+ err);
        console.log(err);
        return Promise.reject(err.message || err);
      }));
  }

  private saveData(): Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let params = {
      "download": this.fatDownloadActivity,
      "downloadList": {
        "cancelled" : this.fatDownloadActivityCancelled,
        "completed" : this.fatDownloadActivityCompleted
      },
      "upload": this.fatUploadActivity,
      "transfer": this.fatTransferActivity
    };

    return this.http
      .put(this.uri, params, options)
      .catch((err => {
          let type = this.type;
          this.log.debug(`save${type}FTAActivity error`, err);
          return null
      }));
  }

  public deleteData():Promise<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .delete(this.uri, options)
      .toPromise()
      .then(res => res.json())
      .catch((err => {
          let type = this.type;
          this.log.debug(`delete${type}FTAActivity error`, err);
          return Promise.reject(err.message || err);
      }));
  }

  async saveActivtiy(activityarr: FTAActivity[]):Promise<any> {
    this.initFTAActivity = true;
    if(this.initFTAActivity) {
      let activity:any;
      for(activity in activityarr){
        switch(activityarr[activity].activitytype){
          case "download":
            if(activityarr[activity].status == "Cancel"){
              this.fatDownloadActivityCancelled.push(activityarr[activity]);
            }else if(activityarr[activity].status == "Complete"){
              this.fatDownloadActivityCompleted.push(activityarr[activity]);
            }
            this.fatDownloadActivity.push(activityarr[activity]);
            this.clearActivity();
            this.type = activityarr[activity].type;
            break;
          case "upload":
            this.fatUploadActivity.push(activityarr[activity]);
            this.clearActivity();
            const uploadListSubscriber =this.saveData().subscribe(()=>{
              if(uploadListSubscriber) uploadListSubscriber.unsubscribe();
            });
            this.type = activityarr[activity].type;
            break;
          case "transfer":
            this.fatTransferActivity.push(activityarr[activity]);
            this.clearActivity();
            const transferListSubscriber =this.saveData().subscribe(()=>{
              if(transferListSubscriber) transferListSubscriber.unsubscribe();
            });
            this.type = activityarr[activity].type;
            break;
          default:
            this.log.debug("No such activity!");
            break;
        }
      }
      const downloadListSubscriber = await this.saveData().subscribe(()=>{
        if(downloadListSubscriber) downloadListSubscriber.unsubscribe();
        Promise.resolve("Saved");
      });
    }
  }

  public clearActivity(){
    if(this.fatTransferActivity.length > this.config.limitofActivityHistory){
      this.fatTransferActivity = this.fatTransferActivity.slice(0,this.config.limitofActivityHistory);
    }
    if(this.fatUploadActivity.length > this.config.limitofActivityHistory){
      this.fatUploadActivity = this.fatUploadActivity.slice(0,this.config.limitofActivityHistory);
    }
    if(this.fatDownloadActivity.length > this.config.limitofActivityHistory){
      this.fatDownloadActivity = this.fatDownloadActivity.slice(0,this.config.limitofActivityHistory);
    }
    if(this.fatDownloadActivityCancelled.length > this.config.limitofActivityHistory){
      this.fatDownloadActivityCancelled = this.fatDownloadActivityCancelled.slice(this.fatDownloadActivityCancelled.length-this.config.limitofActivityHistory);
    }
    if(this.fatDownloadActivityCompleted.length > this.config.limitofActivityHistory){
      this.fatDownloadActivityCompleted = this.fatDownloadActivityCompleted.slice((this.fatDownloadActivityCompleted.length-this.config.limitofActivityHistory));
    }
  }

  public getDownloadActivityList() :FTAActivity[]{
    return this.fatDownloadActivity;
  }

  public getUploadActivityList(){
    return this.fatUploadActivity;
  }

  public getTransferActivityList(){
    return this.fatTransferActivity;
  }

  public getDownloadActivityListCompleted() :FTAActivity[]{
    return this.fatDownloadActivityCompleted;
  }

  public getTransferActivityListCancelled() :FTAActivity[]{
    return this.fatDownloadActivityCancelled;
  }
}

export type FTAActivity = {
    uuid: string;
    fileName: string;
    type: string;
    size: string;
    transfertime: string;
    status: string;
    progress: string;
    activitytype : string;
    remoteFile: string;
    priority: string;
}