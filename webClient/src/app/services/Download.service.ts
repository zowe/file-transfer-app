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
    donwloadedSize = 0;
    totalSize = 1;
    downloadInprogressList: string[] = [];
    config = globals.prod_config;
    startTime = 0;

    constructor(private http: HttpClient, @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger) {
      this.donwloadedSize = 0;
    }

    async fetchFileHanlder(fetchPath: string, fileName: string, remoteFile:string, downnloadObject:any): Promise<any> {
      this.log.debug("started downloading file "+ fileName);
      this.abortController =  new AbortController();
      this.abortSignal = this.abortController.signal;
      this.fileName = fileName;

      // this.totalSize = downnloadObject.size;
      const response = await fetch(fetchPath, {signal: this.abortSignal})

      //mock size for now
      this.totalSize =  Number(response.headers.get('X-zowe-filesize'));
      this.donwloadedSize = 0;

      //time tracker.
      this.startTime = new Date().getTime();

      const readbleStream = response.body != null ? response.body : Promise.reject("Cannot recieve data from the host machine");
      const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 5 });
      streamSaver.WritableStream = WritableStream;
      const fileStream = streamSaver.createWriteStream(fileName, {
        writableStrategy:queuingStrategy,
        readableStrategy: queuingStrategy
      });

      //get writer and lock the file
      const writer = fileStream.getWriter();
      this.currentWriter = writer;

      //get context
      const context = this;
      await new Promise(async resolve => {
        new ReadableStream({
          start(controller) {
            const reader = response.body.getReader();
            read();
            function read() {
              reader.read().then(({done, value}) => {
                if (done) {
                  writer.close();
                  controller.close();
                  context.log.debug("finished writing the contetn to the target file in host machine "+ fileName);
                  resolve();
                }
                if(value != undefined){
                  writer.write(value);
                  context.donwloadedSize++;
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


  updateInProgressObject(status){
    if(this.downloadInprogressList.length > 0){
      this.finalObj = this.downloadInprogressList.shift();
      this.finalObj.status = status;
    }
  }
}