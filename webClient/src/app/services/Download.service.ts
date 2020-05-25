// /*
//   This program and the accompanying materials are
//   made available under the terms of the Eclipse Public License v2.0 which accompanies
//   this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
//   SPDX-License-Identifier: EPL-2.0
//   Copyright Contributors to the Zowe Project.
// */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as streamSaver from 'streamsaver';
import { Angular2InjectionTokens } from 'pluginlib/inject-resources';
import { WritableStream, TransformStream, ReadableStream, CountQueuingStrategy } from 'web-streams-polyfill'

@Injectable()
export class DownloadService {
    progres: number;
    abortController = new AbortController();
    abortSignal: AbortSignal;
    loaded = 0;
    total = 0;
    reader:ReadableStreamReader;
    download = true;
    constructor(private http: HttpClient) {
      this.abortSignal = this.abortController.signal;
    }

    async fetchFileHanlder(fetchPath: string, fileName: string): Promise<any> {
        const response = await fetch(fetchPath, {signal: this.abortSignal})
        const readbleStream = response.body;
        const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 5 });
        streamSaver.WritableStream = WritableStream;
        const fileStream = streamSaver.createWriteStream(fileName, {
          writableStrategy:queuingStrategy,
          readableStrategy: queuingStrategy
        });
        const writer = fileStream.getWriter();
        new ReadableStream({
            start(controller) {
              const reader = response.body.getReader();
      
              read();
              function read() {
                reader.read().then(({done, value}) => {
                  if (done) {
                    writer.close();
                    controller.close();
                    return; 
                  }
                  writer.write(value);
                  read();
                }).catch(error => {
                  console.error(error);
                  controller.error(error)                  
                })
              }
            }
        },queuingStrategy);
    }

    cancelDownload(): void {
        this.abortController.abort();
        this.reader.releaseLock();
        this.total = 0;
        this.loaded = 0;
    }
}
