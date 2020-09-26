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
import { Config } from '../modal/config';
import {ConfigVariables} from '../../shared/configvariable-enum';

@Injectable()
export class FTAConfigService {
  private scope: string = 'user';
  private resourcePath: string = 'ui/ftaConfig';
  private basePlugin: ZLUX.Plugin;

  private resourceName: string;
  private uri: string;
  private initFTAActivity:boolean; 
  private type:string;
  private limitofActivityHistory:number;
  private downloadQueueLength:number;
  public config = globals.prod_config;

  constructor(@Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition
  , @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger
  , private http: Http) {
    this.resourceName = `ftaConfig.json`;
    this.limitofActivityHistory = ConfigVariables.limitofActivityHistory;
    this.downloadQueueLength = ConfigVariables.downloadQueueLength;
  }

  onInit() {
    this.basePlugin = this.pluginDefinition.getBasePlugin();
    this.uri = ZoweZLUX.uriBroker.pluginConfigForScopeUri(this.basePlugin, this.scope, this.resourcePath, this.resourceName);
  }

  public getData():Promise<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(this.uri, options)
      .toPromise()
      .then(res => {
        const resultJson = res.json();
        this.limitofActivityHistory = resultJson.contents["historySize"];
        this.downloadQueueLength = resultJson.contents["queueSize"];
      })
      .catch(this.handleError);
  }

  public saveData(modal: Config): Promise<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .put(this.uri, JSON.stringify(modal), options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public deleteData():Promise<any> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .delete(this.uri, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public getDownloadQueueSize() :number{
    return this.downloadQueueLength;
  }

  public getActivityHistoryLimit() :number{
    return this.limitofActivityHistory;
  }

  private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}
}
