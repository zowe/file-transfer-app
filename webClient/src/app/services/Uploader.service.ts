import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UploaderService {
    chunkIdx: number;

    // constructor(private http: HttpClient) {
    constructor(private http: HttpClient) {
        this.chunkIdx = 0;
    }

    getSessionID(): any {
        const uri = ZoweZLUX.uriBroker.unixFileUri('contents', 'u/ts6531/rocket_key.txt', 'UTF-8', 'IBM-1047', undefined, true);

        return this.http.put(uri, '');
    }

    sendChunk(blob: Blob, lastChunk: boolean, sessionID: number): any { // any should actually be an observable of some kind
        let parameters = new HttpParams();

        parameters = parameters.append('chunkIndex', this.chunkIdx.toString());

        if (sessionID) {
            parameters = parameters.append('sessionID', sessionID.toString());
        }

        if (lastChunk) {
            parameters = parameters.append('lastChunk', 'true');
        }

        const options = {
            params: parameters
        }

        const uri = ZoweZLUX.uriBroker.unixFileUri('contents', 'u/ts6531/rocket_key.txt', 'UTF-8', 'IBM-1047', undefined, true);

        return this.http.put(uri, blob, options);
    }

    chunkAndSendFile(file: File): void {
        const fileSize = file.size;
        const chunkSize = 64 * 1024; // 64 KB
        let offset = 0;
        let sessionID: number;

        const readEventHandler = (event: any) => {
            if (event.target.error === null) {
                offset += chunkSize;
                console.table({'offset': offset, 'fileSize': fileSize});

                let lastChunk = false;
                if (offset >= fileSize) {
                    lastChunk = true;
                }

                const commaIdx = event.target.result.indexOf(',');
                console.log(event.target.result.slice(commaIdx + 1));

                this.sendChunk(event.target.result.slice(commaIdx + 1), lastChunk, sessionID)
                    .subscribe(
                        (response: any) => { // successful PUT
                            console.log('Observable notified - chunkIdx:', this.chunkIdx, ', offset:', offset);
                            console.log('Subscribe response: ', response);
                            if (offset < fileSize) {
                                chunkReaderBlock(offset, chunkSize, file);
                                this.chunkIdx++;
                            }
                        },
                        (error: any) => {
                            console.log('There was an error!!', error);
                        }
                    );
            } else {
                console.log('Read Error: ' + event.target.error);
                return;
            }
            if (offset >= fileSize) {
                console.log('Done Reading File');
            }
        };

        const chunkReaderBlock = (_offset: number, length: number, _file: File) => {
            const reader = new FileReader();
            const blob = _file.slice(_offset, length + _offset);
            reader.onload = readEventHandler;
            reader.readAsDataURL(blob);
        }

        this.getSessionID()
            .subscribe((response: any) => {
                sessionID = response['sessionID'];
                chunkReaderBlock(offset, chunkSize, file);
            }, (error: any) => {
                console.log(error);
            });
    }
}
