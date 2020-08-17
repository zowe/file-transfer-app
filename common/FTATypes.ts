
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
//both serverside and clientside contracts for interacting between them
export enum FTAMessageType {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',//TODO
    LS = 'ls',
    getHomePath = 'getHomePath',
    fastGet = 'fastGet',//save file to local filesystem
    fastPut = 'fastPut',//read file from local filesystem
    makeDir = 'makeDir',
    rmdir = 'rmdir',
    delete = 'delete',
    rename = 'rename',
    fopen = 'fopen',
    fclose = 'fclose',
    cancel = 'cancel',
    data = 'data',
    pipeLR = 'pipeLR',
    pipeRL = 'pipeRL'
}

export enum FTASide {
    LOCAL = 'local',
    REMOTE = 'remote'
}

export class FTAPayload {
  
}
  
export class FTAMessage {
    constructor(type: FTAMessageType, payload: FTAPayload) {
        this.type = type;
        this.payload = payload;
    }
    type: FTAMessageType;
    payload: FTAPayload;
}

export class FTAConnectionTarget {
    constructor(host: string, port: number, username: string, password: string) {
      this.host = host;
      this.port = port;
      this.username = username;
      this.password = password;
    }
    host: string;
    port: number;
    username: string;
    password: string;
}

export class FTAConnectOptions extends FTAPayload {
    protocol: string;
    target: FTAConnectionTarget;
    constructor(protocol: string, target: FTAConnectionTarget) {
      super();
      this.protocol = protocol;
      this.target = target;
    }
}

export class FTAError extends FTAPayload {
    constructor(errorMessage: string) {
        super();
        this.errorMessage = errorMessage;
    }
    errorMessage: string;
    errorContext: any;
}

export class FTASuccess extends FTAPayload {
    success: boolean = true;
}

export class LinuxStatsMask {
    static S_IFMT: number = 0xF000;//0170000
    static S_IFDIR: number = 0x4000;//0040000
}

export class FTAFileAttributes extends FTAPayload {
    constructor() {
        super();
    }
    mode: number;
    size: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    isDirectory: boolean;
    error: string;
}

export class FTAFileInfo extends FTAPayload {
    constructor(side: FTASide, name: string, attributes: FTAFileAttributes) {
        super();
        this.side = side;
        this.name = name;
        this.attributes = attributes;
    }
    side: FTASide;
    name: string;
    attributes: FTAFileAttributes;

    isDirectory(): boolean {
        return this.attributes && this.attributes.isDirectory;
    }
}

export class FTAFolder extends FTAPayload {
    constructor(side: FTASide, path : string, content: FTAFileInfo[]) {
        super();
        this.side = side;
        this.path = path;
        this.content = content;
    }
    side: FTASide;
    path : string;
    content: FTAFileInfo[];
}

export class FTAPath extends FTAPayload {
    constructor(side: FTASide, path: string) {
        super();
        this.side = side;
        this.path = path;
    }
    side: FTASide;
    path: string;
}

export enum FTAFileMode {
    read = 'read',
    write = 'write'
}

export class FTABinaryData {
    constructor(msgVersion: number, sideCode: number, streamId: number, data: any) {
        this.msgVersion = msgVersion;
        this.sideCode = sideCode;
        this.streamId = streamId;
        this.data = data;
    }
    msgVersion: number;
    sideCode: number;
    streamId: number;
    data: any;

    buildMessage(): Blob {
        var header: Buffer = Buffer.allocUnsafe(4);
        header.writeUInt8(this.msgVersion, 0);
        header.writeUInt8(this.sideCode, 1);
        header.writeUInt16BE(this.streamId, 2);
        return new Blob([header, this.data]);
    }

    static buildMessage(msgVersion: number, sideCode: number, streamId: number, data: Buffer|ArrayBuffer|Blob): Blob {
        var header: Buffer = Buffer.allocUnsafe(4);
        header.writeUInt8(msgVersion, 0);
        header.writeUInt8(sideCode, 1);
        header.writeUInt16BE(streamId, 2);
        return new Blob([header, data]);
        //return new FTABinaryData(msgVersion, sideCode, streamId, data).buildMessage();
    }

    static buildNodeMessage(msgVersion: number, sideCode: number, streamId: number, data: Buffer): Buffer {
        var newBuffer = Buffer.allocUnsafe(data.byteLength + 4);//I do not like this
        newBuffer.writeUInt8(msgVersion, 0);
        newBuffer.writeUInt8(sideCode, 1);
        newBuffer.writeUInt16BE(streamId, 2);
        data.copy(newBuffer, 4, 0,data.byteLength);
        return newBuffer;
        //return new FTABinaryData(msgVersion, sideCode, streamId, data).buildMessage();
    }

    static parseMessage(msg: Buffer|DataView): FTABinaryData {
        var headerNumber: number;
        var length: number;
        var buf: ArrayBuffer;
        var internalOffset: number = 0;
        if (msg instanceof DataView) {
            headerNumber = msg.getUint32(0);
            length = msg.byteLength;
            buf = msg.buffer;
            internalOffset = msg.byteOffset;
        } else {
            headerNumber = msg.readUIntBE(0, 4);
            length = msg.length;
            buf = msg.buffer;
            internalOffset = msg.byteOffset;
        }
        return FTABinaryData.createBinaryData(headerNumber, length, buf, internalOffset);
    }

    static createBinaryData(headerNumber: number, length: number, buf: ArrayBuffer, internalOffset: number) {
        var msgVersion = (headerNumber>>24)&0xFF;
        var sideCode = (headerNumber>>16)&0xFF;
        var streamId = headerNumber&0xFFFF;
        var buffer: Buffer = Buffer.from(buf, internalOffset+4, length - 4);
        return new FTABinaryData(msgVersion, sideCode, streamId, buffer);
    }

    static parseBlob(blob: Blob, callback: (binData: FTABinaryData) => void) {
        var reader = new FileReader();
        reader.onload = function(event) {
            let result: ArrayBuffer;
            result = reader.result as ArrayBuffer;
            var dv: DataView = new DataView(reader.result);
            var header: number = dv.getUint32(0);
            var length: number = dv.byteLength;
            var buf: ArrayBuffer = dv.buffer;
            var internalOffset: number = dv.byteOffset;
            callback(FTABinaryData.createBinaryData(header, length, buf, internalOffset));
        };
        reader.readAsArrayBuffer(blob);
    }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
