

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
import {GrowlModule} from 'primeng/growl';
import {TabViewModule} from 'primeng/tabview';
import {ButtonModule} from 'primeng/button';
import {TreeModule} from 'primeng/tree';
import {DataTableModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar'
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {PasswordModule} from 'primeng/password';
import {MessagesModule} from 'primeng/messages';
import {ProgressBarModule} from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';

import { AppComponent } from './app.component';
import { ConnectionViewComponent } from './connection-view-component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ConnectionPanelComponent } from './connection-panel/connection-panel.component';
import { FTAWebsocketService } from './services/FTAWebsocket.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionViewComponent,
    BrowserPanelComponent,
    ConnectionPanelComponent
  ],
  imports: [
    // BrowserModule, /* remove this for within-MVD development */
    GrowlModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TabViewModule,
    TreeModule,
    FormsModule,
    MessagesModule,
    ProgressBarModule,
    TableModule,
    DataTableModule,
    MenubarModule,
    ContextMenuModule,
    FileUploadModule,
    HttpClientModule
  ],
  providers: [FTAWebsocketService],
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

