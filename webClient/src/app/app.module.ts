/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TreeModule } from 'primeng/tree';
import { DataTableModule } from 'primeng/primeng';

import { ButtonModule } from 'carbon-components-angular/button/button.module';
import { InputModule } from 'carbon-components-angular/input/input.module';
import { ModalModule } from 'carbon-components-angular/modal/modal.module';
import { DropdownModule } from 'carbon-components-angular/dropdown/dropdown.module';

import { HttpClientModule } from '@angular/common/http';
import { UploaderService } from './services/Uploader.service'
import { FTAWebsocketService } from './services/FTAWebsocket.service';

import { AppComponent } from './app.component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ConnectionPanelComponent } from './connection-panel/connection-panel.component';
import { UploaderPanelComponent } from './uploader-panel/uploader-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    BrowserPanelComponent,
    ConnectionPanelComponent,
    UploaderPanelComponent
  ],
  imports: [
    // BrowserModule, /* remove this for within-MVD development */
    CommonModule,
    DataTableModule,
    TreeModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputModule,
    ModalModule,
    DropdownModule
  ],
  providers: [FTAWebsocketService, UploaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
