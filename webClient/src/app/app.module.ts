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
import { RouterModule } from '@angular/router';

import { TreeModule } from 'primeng/tree';
import { DataTableModule } from 'primeng/primeng';

import { ButtonModule} from 'carbon-components-angular/button/button.module';
import { InputModule} from 'carbon-components-angular/input/input.module';
import { ModalModule} from 'carbon-components-angular/modal/modal.module';
import { DropdownModule} from 'carbon-components-angular/dropdown/dropdown.module';
import { LoadingModule} from 'carbon-components-angular/loading/loading.module';
import { TabsModule } from 'carbon-components-angular/tabs/tabs.module';
import { GridModule } from 'carbon-components-angular/grid/grid.module';
import { TilesModule } from 'carbon-components-angular/tiles/tiles.module';
import { AccordionModule } from 'carbon-components-angular/accordion/accordion.module';
import { TableModule } from 'carbon-components-angular/table/table.module';
import { NFormsModule } from 'carbon-components-angular/forms/forms.module';
import { DialogModule } from 'carbon-components-angular/dialog/dialog.module';
import { SearchModule } from 'carbon-components-angular/search/search.module';
import { NotificationModule } from 'carbon-components-angular/notification/notification.module';
import { PaginationModule } from "carbon-components-angular/pagination/pagination.module";

import { DownloadModule, UploadModule, SettingsModule, DeleteModule, SaveModule, AddModule } from '@carbon/icons-angular';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { UploaderService } from './services/Uploader.service'
import { DownloadService } from './services/Download.service';
import { FTAWebsocketService } from './services/FTAWebsocket.service';\

import { AppComponent } from './app.component';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { ConnectionPanelComponent } from './connection-panel/connection-panel.component';
import { ActivityPanelComponent } from './activity-panel/activity-panel.component';
import { UploaderPanelComponent } from './uploader-panel/uploader-panel.component';
import { FileTreeModule } from '@zowe/zlux-angular-file-tree';
import { MatSnackBarModule } from '@angular/material'

@NgModule({
  declarations: [
    AppComponent,
    BrowserPanelComponent,
    ConnectionPanelComponent,
    UploaderPanelComponent,
    ActivityPanelComponent
  ],
  imports: [
    RouterModule,
    // BrowserModule, /* remove this for within-MVD development */
    CommonModule,
    DataTableModule,
    TreeModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    ButtonModule,
    FileTreeModule,
    PaginationModule,
    InputModule,
    DownloadModule,
    TabsModule,
    AccordionModule,
    GridModule,
    TilesModule,
    UploadModule,
    ModalModule,
    DropdownModule,
    LoadingModule,
    MatSnackBarModule,
    NotificationModule,
    TableModule,
    NFormsModule,
    DialogModule,
    SearchModule
  ],
  providers: [FTAWebsocketService, UploaderService,DownloadService],
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
