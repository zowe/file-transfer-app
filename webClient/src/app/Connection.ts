
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { FTAWebsocketService } from './services/FTAWebsocket.service';

export class Connection {
    name: string;
    protocol: string;
    address: string;
    port: number;

    ftaWs: FTAWebsocketService;

    constructor(name: string, ftaWs: FTAWebsocketService) {
        this.name = name;
        this.ftaWs = ftaWs;
    }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
