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


@Injectable()
export class FTAActivityService {
  private scope: string = 'user';
  private resourcePath: string = 'ui/ftaactivity';
  private basePlugin: ZLUX.Plugin;

  private resourceName: string;
  private uri: string;
  public fatDownloadActivity: FTAActivity[];
  public fatUploadActivity: FTAActivity[];
  public fatTransferActivity: FTAActivity[];
  private initFTAActivity:boolean; 
  private type:string;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition
  ,  private http: Http) {
    
  }

  onInit() {
    this.basePlugin = this.pluginDefinition.getBasePlugin();
    this.resourceName = `activity.json`;
    this.uri = ZoweZLUX.uriBroker.pluginConfigForScopeUri(this.basePlugin, this.scope, this.resourcePath, this.resourceName);
    this.fatUploadActivity = [];
    this.fatDownloadActivity = [];
    this.fatTransferActivity = [];
  }

  public getData():  Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    const getRequest =  this.http
      .get(this.uri, options)
      .map(res => res.json())
      .catch((err => {
          console.log(err);
          return null;
      }));
      return getRequest;
  }

  private saveData(): Observable<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let params = {
        "download": this.fatDownloadActivity,
        "upload": this.fatUploadActivity,
        "transfer": this.fatTransferActivity
    };

    return this.http
      .put(this.uri, params, options)
      .catch((err => {
          let type = this.type;
          console.log(`save${type}FTAActivity error`, err);
          return null
      }));
  }

  public saveActivtiy(activityarr: FTAActivity[]):any {
    this.initFTAActivity = true;
    if(this.initFTAActivity) {
      let activity:any;
      for(activity in activityarr){
        switch(activityarr[activity].activitytype){
          case "download":
            this.fatDownloadActivity.push(activityarr[activity]);
            this.clearActivity();
            const sub =this.saveData().subscribe(()=>{
              if(sub) sub.unsubscribe();
            });
            this.type = activityarr[activity].type;
            break;
          case "upload":
            this.fatUploadActivity.push(activityarr[activity]);
            this.clearActivity();
            const sub2 =this.saveData().subscribe(()=>{
              if(sub2) sub2.unsubscribe();
            });
            this.type = activityarr[activity].type;
            break;
          case "transfer":
            this.fatTransferActivity.push(activityarr[activity]);
            this.clearActivity();
            const sub3 =this.saveData().subscribe(()=>{
              if(sub3) sub3.unsubscribe();
            });
            this.type = activityarr[activity].type;
            break;
          default:
            console.log("No such activity!");
            break;
        }
      }
    }
  }

  public clearActivity(){
    if(this.fatTransferActivity.length > 10){
      this.fatTransferActivity = this.fatTransferActivity.slice(0,10);
    }
    if(this.fatUploadActivity.length > 10){
      this.fatUploadActivity = this.fatUploadActivity.slice(0,10);
    }
    if(this.fatDownloadActivity.length > 10){
      this.fatDownloadActivity = this.fatDownloadActivity.slice(0,10);
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
}

export type FTAActivity = {
    fileName: string;
    type: string;
    size: string;
    transfertime: string;
    status: string;
    progress: string;
    activitytype : string;
}