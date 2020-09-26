// /*
//   This program and the accompanying materials are
//   made available under the terms of the Eclipse Public License v2.0 which accompanies
//   this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
//   SPDX-License-Identifier: EPL-2.0
//   Copyright Contributors to the Zowe Project.
// */

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as streamSaver from 'streamsaver'
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { WritableStream, TransformStream, ReadableStream, CountQueuingStrategy } from 'web-streams-polyfill'
import * as globals from '../../environments/environment';
import * as uuid from 'uuid';
import { ReplaySubject } from 'rxjs';
import {ConfigVariables} from '../../shared/configvariable-enum';


@Injectable({
  providedIn: "root",
})
export class DownloadService {
    progres: number;
    abortController: AbortController;
    abortSignal: AbortSignal;
    reader:ReadableStreamReader;
    download = true;
    fileName = "";
    currentWriter ;
    downObj = null;
    finalObj = null;
    downloadedSize = 0;
    totalSize = 1;
    downloadInprogressList: string[] = [];
    config = globals.prod_config;
    startTime = 0;
    completeStatus = ConfigVariables.statusComplete;

    constructor(private http: HttpClient, @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger) {
      this.downloadedSize = 0;
    }

    //main function to handle the large downloads.
    async fetchFileHandler(fetchPath: string, fileName: string, remoteFile:string, downloadObject:any): Promise<any> {
      this.log.debug("started downloading file "+ fileName);
      this.abortController =  new AbortController();
      this.abortSignal = this.abortController.signal;
      this.fileName = fileName;
      this.totalSize = downloadObject.size;
      this.initializeDownloadObject(downloadObject);

      //define the endcoding type.
      if(downloadObject.sourceEncoding != undefined && downloadObject.targetEncoding != undefined){
        let queriesObject =
          {
           "source": downloadObject.sourceEncoding,
           "target": downloadObject.targetEncoding
          };
        
        fetchPath = fetchPath+"?"+await this.getQueryString(queriesObject);
      }

      const response = await fetch(fetchPath, {signal: this.abortSignal})

      //mock size for now
      // this.totalSize =  Number(response.headers.get('X-zowe-filesize'));
      this.downloadedSize = 0;

      this.startTime = new Date().getTime();

      //get the stream from the resposnse body.
      const readbleStream = response.body != null ? response.body : Promise.reject("Cannot recieve data from the host machine");
      //queieng stratergy.
      const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 5 });
      //for browsers not supporting writablestram make sure to assign the polyfil writablestream.
      streamSaver.WritableStream = WritableStream;
      //create the write stream.
      const fileStream = streamSaver.createWriteStream(fileName, {
        writableStrategy:queuingStrategy,
        readableStrategy: queuingStrategy
      });
      const writer = fileStream.getWriter();
      this.currentWriter = writer;
      //assign _.this to context.
      const context = this;
      await new Promise(async resolve => {
        new ReadableStream({
          start(controller) {
            const reader = response.body.getReader();
            read();
            function read() {
              reader.read().then(({done, value}) => {
                //end of download.
                if (done) {
                  writer.close();
                  controller.close();
                  context.updateInProgressObject(context.completeStatus);
                  context.log.debug("finished writing the content to the target file in host machine "+ fileName);
                  resolve();
                }
                if(value != undefined){
                  writer.write(value);
                  context.downloadedSize++;
                  context.writeProgress(context.downloadedSize);
                  read();
                }
              }).catch(error => {
                context.log.debug("error in download "+ error);
                console.error(error);
                controller.error(error);   
                resolve(error);               
              })
            }
          }
        },queuingStrategy);
      });
    }

    //create query strings to append in the request.
    getQueryString(queries){
      return Object.keys(queries).reduce((result, key) => {
          console.log(key);
          console.log(ConfigVariables[queries[key]]);
          return [...result, `${encodeURIComponent(key)}=${encodeURIComponent(ConfigVariables[queries[key]])}`]
      }, []).join('&');
    };

    //push the object to inprogress list.
    initializeDownloadObject(downloadObject: any){
      this.downloadInprogressList.push(downloadObject);
    }

    writeProgress(size){
      this.downloadedSize = size;
    }
  
    //expose the current progress.
    getProgress(){
      return this.downloadedSize;
    }

    //update in progress object.
    updateInProgressObject(status){
      if(this.downloadInprogressList.length > 0){
        this.finalObj = this.downloadInprogressList.shift();
        this.finalObj.status = status;
      }
    }

    //cancel current download.
    cancelDownload(): void {
      if(this.currentWriter){
        this.currentWriter.abort();
        this.currentWriter.releaseLock();
        this.abortController.abort();
        this.totalSize = 1;
        this.downloadedSize = 0; 
        this.updateInProgressObject(ConfigVariables.statusInprogress);
        this.log.debug("cancelled current download");
      }
    }
}