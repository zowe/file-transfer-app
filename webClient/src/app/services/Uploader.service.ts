import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UploaderService {
    constructor(private http: HttpClient) { }

    chunkAndSendFile(file: File, uploadDirPath: string): void {
        const fileSize = file.size;
        const chunkSize =  3 * 1024 * 1024; // bytes
        let sourceEncoding = 'BINARY';
        let targetEncoding = 'BINARY';
        let chunkIdx = 0;
        let offset = 0;
        let sessionID: number;
        let uri = ZoweZLUX.uriBroker.unixFileUri('contents', uploadDirPath.slice(1) + '/' + file.name, sourceEncoding, targetEncoding, undefined, true);

        console.table({'URI': uri, 'File Name': file.name, 'File Size': fileSize, 'Chunk Size': chunkSize});

        // Initiate connection with the zssServer
        const getSessionID = () => {
            return this.http.put(uri, '');
        }

        // Generate the HTTP PUT request and return an Observable for the response
        const sendChunk = (blob: Blob, lastChunk: boolean, sessionID: number) => { // any should actually be an observable of some kind
            let parameters = new HttpParams();
            parameters = parameters.append('chunkIndex', chunkIdx.toString());

            if (sessionID) {
                parameters = parameters.append('sessionID', sessionID.toString());
            }
            if (lastChunk) {
                parameters = parameters.append('lastChunk', 'true');
            }
            const options = {
                params: parameters
            }

            return this.http.put(uri, blob, options);
        }

        // Once the chunk is read we must package it in an HTTP request and send it to the zss Server
        const readEventHandler = (event: any) => {
            if (event.target.error === null) {
                offset += chunkSize;

                let lastChunk = false;
                if (offset >= fileSize) {
                  offset = fileSize;
                  lastChunk = true;
                  console.log('Sending last chunk');
                }

                console.table({'offset': offset, 'fileSize': fileSize, 'progress': offset/fileSize});

                const commaIdx = event.target.result.indexOf(',');

                sendChunk(event.target.result.slice(commaIdx + 1), lastChunk, sessionID)
                    .subscribe(
                        (response: any) => { // successful PUT
                            console.log('Chunk sent - chunkIdx:', chunkIdx, ', offset:', offset);
                            if (offset < fileSize) {
                                chunkReaderBlock(offset, chunkSize, file);
                                chunkIdx++;
                            }
                        },
                        (error: any) => {
                            console.log(error);
                        }
                    );
            } else {
                console.log('Read Error: ' + event.target.error);
                return;
            }
        };

        // Read slice of file, then run the readEventHandler
        const chunkReaderBlock = (_offset: number, length: number, _file: File) => {
            const reader = new FileReader();
            const blob = _file.slice(_offset, length + _offset);
            reader.onload = readEventHandler;
            reader.readAsDataURL(blob); // Base 64
        }

        getSessionID()
            .subscribe((response: any) => {
                sessionID = response['sessionID'];
                chunkReaderBlock(offset, chunkSize, file);
            }, (error: any) => {
                console.log(error);
            });
    }
}
