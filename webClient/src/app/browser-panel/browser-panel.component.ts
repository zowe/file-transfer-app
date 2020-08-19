/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { Component, OnInit, Input, ViewChild, Inject, AfterViewInit , EventEmitter, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Connection } from '../Connection';
import { Message } from 'primeng/components/common/api';
import { FTASide, FTAFileInfo, FTAFileMode } from '../../../../common/FTATypes';
import { FileTreeComponent as ZluxFileTreeComponent } from '@zlux/file-explorer/src/plugin';
import { UploaderPanelComponent } from '../uploader-panel/uploader-panel.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';
import { Angular2InjectionTokens,Angular2PluginViewportEvents } from 'pluginlib/inject-resources';
import { DownloadService } from '../services/Download.service';
import * as globals from '../../environments/environment';
import * as uuid from 'uuid';
import { FTAConfigService } from '../services/FTAConfig.service';

class TreeNodeData {
    attributes: any;
    needUpdate: boolean;
    virtual: boolean;
    files: FileRow[];

    constructor(attributes: any, needUpdate: boolean) {
        this.attributes = attributes;
        this.needUpdate = needUpdate;
    }
}

class FileRow {
    treeNode: TreeNode;
    name: string;
    isDir: boolean;
    size: string;
    attributes: string;
    isEditable: boolean;
    nameBackup: string;

    constructor(treeNode: TreeNode, name: string, isDir: boolean, size: string, attributes: string) {
        this.treeNode = treeNode;
        this.name = name;
        this.isDir = isDir;
        this.size = size;
        this.attributes = attributes;
        this.isEditable = false
    }
}

@Component({
    selector: 'app-browser-panel',
    templateUrl: './browser-panel.component.html',
    styleUrls: [
    // '../../../node_modules/carbon-components/css/carbon-components.min.css',
    // '../../../node_modules/primeng/resources/primeng.min.css',
    './browser-panel.component.scss',
    '../../styles.scss'
    ]

})

export class BrowserPanelComponent implements AfterViewInit, OnInit {

    @Input() connection;
    @Input() ftaSide;
    @Input() cancelEvent;
    @Input() priorityDownloadEvent;

    //download start trigger.
    @Output() downloadTrigger = new EventEmitter();
    //end download trigger.
    @Output() downloadEndTrigger = new EventEmitter();

    @ViewChild(ZluxFileTreeComponent)
    fileExplorer: ZluxFileTreeComponent;
    downloadInProgress: boolean;
    downloadQueue: string [];
    downloadObjectQueue: string [];
    downloadRemoteFileQueue: string [];
    downloadInProgressList: string [];
    objectToDownload = null;
    public config = globals.prod_config;

    fileView: string;
    tree: TreeNode[] = [];
    treeSelectedNode: TreeNode;
    listSelection: FileRow;
    list: FileRow[];
    selectedPath: string;
    selectedFileSize: string;
    enableDownload:boolean = true;
    selectedFileType:string;
    errorMessages: Message[] = [];

    contextSide: FTASide;
    contextTreeNode: TreeNode;
    contextRow: FileRow;

    uploadModalVisible: boolean;
    uploadConfigModalVisible: boolean;

    toggleText = ["Binary", "Autoconvert"];
    activateAutomaticConvertion = false;
    encodings = ["ASCII", "EBCDIC", "UTF8"];

    constructor(@Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger, 
    private downloadService:DownloadService,
    private ftaConfig:FTAConfigService,
    @Inject(Angular2InjectionTokens.VIEWPORT_EVENTS) private viewportEvents: Angular2PluginViewportEvents) { }

    get sideLocal(): FTASide {
        return FTASide.LOCAL;
    }
    get sideRemote(): FTASide {
        return FTASide.REMOTE;
    }

    ngOnInit(): void {
        this.downloadQueue = [];
        this.downloadRemoteFileQueue = [];
        this.downloadInProgressList = [];
        this.downloadObjectQueue = [];
        this.log.debug('ngOnInit this.connection.name=' + this.connection.name);

        this.fileView = 'tree';
        this.uploadModalVisible = false;
        this.uploadConfigModalVisible = false;

        this.connection.ftaWs.onError((err) => {
            this.showError(err);
        });

        this.connection.ftaWs.onHomePath((err: any, system: FTASide, path: string) => {
            this.log.debug('FTA onHomePath system= ' + system + ' path=' + path);
            if (err) {
                this.showError(err);
                return;
            }
            this.selectedPath = path;
            this.treeSelectedNode = this.ensurePath(this.tree, path);
            this.expandNode(this.treeSelectedNode);
            this.connection.ftaWs.ls(this.ftaSide, path);
        });

        this.connection.ftaWs.onLs((err: any, system: FTASide, path: string, fileInfos: FTAFileInfo[]) => {
            this.log.debug('FTA onLs system= ' + system + ' path=' + path + ' ' + JSON.stringify(fileInfos));
            if (err) {
                this.showError(err);
                return;
            }
                const node: TreeNode = this.ensurePath(this.tree, path);
                this.list = this.createFileRows(node);
                this.cleanChildren(node);
                fileInfos.forEach(fileinfo => {
                    this.getOrCreateChildNode(node, fileinfo.name, fileinfo);
                });
                this.sortFileRows(this.list);
                this.selectedPath = this.getPathFromRoot(node);
                this.treeSelectedNode = node;
                this.expandNode(this.treeSelectedNode);
        });

        this.connection.ftaWs.getHomePath(this.ftaSide);

        this.viewportEvents.registerCloseHandler(():Promise<void>=> {
            return new Promise((resolve,reject)=> {
              this.ngOnDestroy();
              resolve();
            });
        });
    }

    onChange(event){
        //set the autoatic convertion status.
        if(event.checked){
            this.activateAutomaticConvertion = true;
        }else{
            this.activateAutomaticConvertion = false;
        }
    }

    ngOnDestroy(): void {
        this.log.debug('cancel inprogress/queued downloads.');
        this.downloadQueue = [];
        this.downloadRemoteFileQueue =[];
        this.downloadObjectQueue = [];
        this.downloadService.cancelDownload();
    }

    ngAfterViewInit(){
        // Funky dummy tab used for UI alignment
        this.fileExplorer.tabs = [{ index: 0, name: "USS" }, {index:0, name: ""}];
    }

    treeView(): void {
        this.fileView = 'tree';
    }

    listView(): void {
        this.fileView = 'list';
    }

    isFolder(subtree: TreeNode): boolean {
        if (subtree.data && (<TreeNodeData>subtree.data).attributes) {
            return (<FTAFileInfo>(<TreeNodeData>subtree.data).attributes).attributes.isDirectory;
        }
        return !!subtree.children;
    }

    fopen(side: FTASide, pathToOpen: string, mode: FTAFileMode, onOpen: (err: any, streamId: number) => void): void {
        this.log.debug('fopen side=' + side + ' pathToOpen=' + pathToOpen + ' mode=' + mode);
        this.connection.ftaWs.fopen(side, pathToOpen, mode, onOpen);
    }

    sendTo(): void {

    }

    showUploadModal(): void {
        this.uploadModalVisible = true;
    }

    showConfigModal(): void{
        this.uploadConfigModalVisible = true;
    }

    closeUploadModal(): void {
        this.uploadModalVisible = false;
        this.fileExplorer.updateDirectory(this.getSelectedDirectory());
    }

    closeConfigModal(): void {
        this.uploadConfigModalVisible = false;
    }

    getSelectedDirectory(): string {
        return this.selectedPath;
    }
    onNodeClick($event:any){
        if ($event.directory == false) { 
            this.selectedPath = $event.path;
            this.selectedFileSize = $event.size;
            this.enableDownload = true;
            this.selectedFileType = $event.data;
        } else {
            let folderPath = $event.path.substring($event.path.lastIndexOf("\\") + 1, $event.path.length);
            this.log.debug(folderPath);
            this.selectedPath = folderPath;
            this.enableDownload = false;
        }
        this.log.debug(this.selectedPath);
    }

    onPathChanged($event: any) {
        this.selectedPath = $event;
    }

    saveAs(sourceEncording?:any, targetEncoding?:any): void {
        const uri = ZoweZLUX.uriBroker.unixFileUri('contents', this.selectedPath.slice(1), undefined, undefined, undefined, true);
        this.log.debug(uri);
        const tokens = this.selectedPath.split('/');
        const filename = tokens[tokens.length - 1];
        this.log.debug('saveAs filename=' + filename);
        const a = document.createElement('a');
        this.log.debug('downloading from uri', uri, 'with path ',this.selectedPath);
        a.href = uri;
        //staart the donwload.
        this.startDownload(filename, this.selectedPath, null, sourceEncording,targetEncoding).then(res => {
            this.log.debug('completed download');
        }).catch((err) => {
            this.log.debug('error downloading '+ err);
        });
        // a.download = filename;
        // a.click();
        this.log.debug('clicked link');
    }

    //cancel the download.
    cancelDown(){
        this.downloadService.cancelDownload();
        var cancelObj = null;
        cancelObj  = this.downloadInProgressList.shift() ;
        cancelObj.status = this.config.statusList[2];
        this.downloadEndTrigger.emit(cancelObj);
    }

    startDownload(filename:string, remotePath:string, downloadObject?:any, sourceEncording?:any, targetEncoding?:any): Promise<any>{
        //check if download in progress.
        if(!this.downloadInProgress){
            this.initilizeDownloadObject(this.config.statusList[0], remotePath, filename, downloadObject, sourceEncording, targetEncoding).then((downloadObject)=> {
                this.downloadInProgress = true;
                downloadObject.status = this.config.statusList[0];
                //todo after test change to the uri.
                this.downloadService.fetchFileHanlder("https://localhost:8544/unixfile/contents"+ remotePath,filename,remotePath, downloadObject).then((res) => {
                    this.downloadEndTrigger.emit(this.downloadService.finalObj);
                    if(this.downloadQueue.length > 0){
                        this.downloadInProgress = false;
                        //after end of a download shift the queue and start the next download.
                        this.startDownload(this.downloadQueue.shift(),this.downloadRemoteFileQueue.shift(),this.downloadObjectQueue.shift());
                    }else{
                        // fires when download queue is empty.
                        this.downloadInProgress = false;
                        return Promise.resolve("Completed All downloads");
                    }
                }).catch((err) => {
                    return Promise.reject(err);
                });
                //add to inrprogress list.
                this.downloadInProgressList.push(downloadObject);
                //emit the download start event.
                this.downloadTrigger.emit(downloadObject);
            })
        }else{
            //if already download inprogress check the download queue size 
            //from the user config and add to the queue.
            if(this.downloadQueue.length < this.ftaConfig.getDownloadQueueSize()){
                this.initilizeDownloadObject(this.config.statusList[3], remotePath, filename, null, sourceEncording, targetEncoding).then((downloadObject)=> {
                    this.downloadQueue.push(filename);
                    this.downloadRemoteFileQueue.push(remotePath);
                    this.downloadObjectQueue.push(downloadObject);
                    this.downloadTrigger.emit(downloadObject);
                    return Promise.resolve("Added to the queue");
                });
            }else{
                return Promise.resolve("Already exceeds the queuing limit please try after one or more download finishes");
            }
        }
    }

    //initilize the download object.
    //values which hare hard coded are to be replaced after the download time api is ready from zss.
    initilizeDownloadObject(status:string, remoteFile:string, fileName:string , downloadObj? : any, sourceEncording?:any, targetEncoding?:any):Promise<any>{
        if(downloadObj != null){
            downloadObj.status = this.config.statusList[0];
            return Promise.resolve(downloadObj);
        }else{
            return Promise.resolve(this.objectToDownload = {
                uuid : uuid.v4(),
                fileName: fileName,
                type: this.selectedFileType,
                size: this.selectedFileSize,
                transfertime: "00.012.21.0",
                status: status,
                progress: "0",
                activitytype: "download",
                remoteFile: remoteFile,
                priority: this.config.priority[0],
                sourceEncording: sourceEncording,
                targetEncoding: targetEncoding
            });
        }
       
    }

    ngOnChanges(changes) {
        //capture the cancel event.
        if(changes.cancelEvent != null){
          if(changes.cancelEvent.currentValue != null){
            //when the inprogress object got cancel just cnacel the downlod and clean.
            if(changes.cancelEvent.currentValue.status == this.config.statusList[0]){
                this.cancelDown();
            // when a queued download is cancelled make sure to remove it from the 
            // downloadQueue downloadRemoteFileQueue as well so it won't continue to hold these values.
            }else if(changes.cancelEvent.currentValue.status == this.config.statusList[3]){
                this.findExisitingObject(changes.cancelEvent.currentValue.fileName,this.downloadQueue).then((index)=> {
                    this.downloadQueue.splice(index,1);
                    this.downloadRemoteFileQueue.splice(index,1);
                    var cancelObj = [];
                    cancelObj = this.downloadObjectQueue.splice(index,1);
                    this.downloadEndTrigger.emit(cancelObj[0]);
                });
            }
          }
        }
        //capture priority download event
        if(changes.priorityDownloadEvent != null){
            if(changes.priorityDownloadEvent.currentValue != null){
                this.findExisitingObject(changes.priorityDownloadEvent.currentValue.fileName, this.downloadQueue).then((index)=> {
                    if(index >= 0){
                        //splice object and take out the priority object
                        const highPriorityDownQueue = this.downloadQueue.splice(index,1);
                        const highPriorityRemoteFileQueue = this.downloadRemoteFileQueue.splice(index,1);
                        var priorityObj = [];
                        priorityObj = this.downloadObjectQueue.splice(index,1);

                      if(changes.priorityDownloadEvent.currentValue.priority == this.config.priority[1]){
                          this.downloadQueue.unshift(highPriorityDownQueue[0]);
                          this.downloadRemoteFileQueue.unshift(highPriorityRemoteFileQueue[0]);
                          this.downloadObjectQueue.unshift(priorityObj[0]);
                      }else{
                        this.downloadQueue.push(highPriorityDownQueue[0]);
                        this.downloadRemoteFileQueue.push(highPriorityRemoteFileQueue[0]);
                        this.downloadObjectQueue.push(priorityObj[0]);
                      }
                    }
                  });
            }
          }
    }

    //find the existing object.
    findExisitingObject(objectToFind, objectArray){
        const existingObject = objectArray.findIndex(obj => obj == objectToFind)
        return Promise.resolve(existingObject);
    }

    getSelectedPath(){
        this.log.debug('selected path',this.selectedPath);
        return this.selectedPath;
    }

    needUpdate(subtree: TreeNode): boolean {
        return (<TreeNodeData>subtree.data).needUpdate;
    }

    pathFieldEnter(side: FTASide, pathEntered: string): void {
        this.log.debug('pathFieldEnter side=' + side + ' pathEntered=' + pathEntered);
        this.connection.ftaWs.ls(this.ftaSide, pathEntered);
    }

    treeNodeSelect(event: any): void {
        this.selectedPath = this.getPathFromRoot(event.node);
        if (this.isFolder(event.node)) {
            if (this.needUpdate(event.node)) {
                this.connection.ftaWs.ls(this.ftaSide, this.selectedPath);
            }
            this.list = (<TreeNodeData>event.node.data).files;
            this.listSelection = this.list[0];
        } else {
            const row = this.getFileRow(event.node);
            if (row) {
                this.listSelection = row;
            } /*else {
                // TODO how to deselect?
                this.listSelection = null;
            }*/
        }
    }

    treeNodeExpand(event: any): void {
        if (event.node) {
            this.log.debug('treeNodeExpand ' + this.getPathFromRoot(event.node));
        }
    }

    isUpRow(row: FileRow): boolean {
        return row.isDir && row.name === '..';
    }

    getParent(subtree: TreeNode): TreeNode {
        if (subtree.parent) {
            return subtree.parent;
        }
        return subtree;
    }

    listSelect(event: any): void {
        this.log.debug('listSelect ' + event.data);
        const fileRow: FileRow  = <FileRow>event.data;
        if (this.isUpRow(fileRow)) {
            this.treeSelectedNode = this.getParent(this.treeSelectedNode);
        } else {
            this.treeSelectedNode = fileRow.treeNode;
        }
    }

    listRowDblclick(event: any): void {
        this.log.debug('listRowDblclick ' + event.data);
        const fileRow: FileRow  = <FileRow>event.data;
        if (fileRow.isDir && fileRow.treeNode) {
            this.selectedPath = this.getPathFromRoot(fileRow.treeNode);
            if (this.needUpdate(fileRow.treeNode)) {
                this.connection.ftaWs.ls(this.ftaSide, this.selectedPath);
            }
            this.treeSelectedNode = fileRow.treeNode;
            this.treeSelectedNode.expanded = true;
            this.list = (<TreeNodeData>this.treeSelectedNode.data).files;
        }
    }

    rowDataInputEnter(row: FileRow): void {
        this.log.debug('rowDataInputEnter on ' + row.nameBackup + ' -> ' + row.name);
        this.contextRow = row;
        row.isEditable = false;
        const newName = row.name;
        const node = row.treeNode;
        const pathToRename: string = this.getPathFromRoot(node);
        const parentNode = this.getParent(node);
        const newPath: string = this.getPathFromRoot(parentNode, newName);
        this.rename(this.contextSide, pathToRename, newPath);
    }

    rowDataInputEscape(row: FileRow): void {
        this.log.debug('rowDataInputEscape on ' + row.nameBackup);
        row.name = row.nameBackup;
        row.isEditable = false;
        delete this.contextRow;
    }

    rename(side: FTASide, pathToRename: string, newPath: string): void {
        this.log.debug('rename side=' + side + ' pathToRename=' + pathToRename + ' newPath=' + newPath);
        this.connection.ftaWs.rename(side, pathToRename, newPath);
    }

    getFileRow(node: TreeNode): FileRow | undefined {
        if (node.parent) {
            const parentNode: TreeNode = node.parent;
            const list: FileRow[] = (<TreeNodeData>parentNode.data).files;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name === this.getName(node)) {
                    return list[i];
                }
            }
        }
        return undefined;
    }

    uploadBtn(uploadElement: any, side: FTASide): void {
        this.log.debug('testUpload ' + uploadElement);
        uploadElement.basicFileInput.nativeElement.click()
    }

    cleanChildren(subtree: TreeNode): void {
        delete subtree.children;
    }

    newNode(label: string, fileInfo: FTAFileInfo | undefined = undefined): TreeNode {
        if (fileInfo && fileInfo.attributes && fileInfo.attributes.isDirectory) {
            return this.newFolderNode(label, fileInfo);
        } else {
            return {'label' : label, 'data': new TreeNodeData(fileInfo, false), icon: 'fa fa-file'};
        }
    }

    getOrCreateChildNode(subtree: TreeNode, name: string, fileinfo: FTAFileInfo): TreeNode | undefined {
        let childNode = this.getChildNode(subtree, name);
        if (!childNode) {
            this.addChild(subtree, childNode = this.newNode(name, fileinfo));
        }
        (<TreeNodeData>subtree.data).files.push(new FileRow(childNode, fileinfo.name, fileinfo.attributes.isDirectory,
        '' + fileinfo.attributes.size, '' + fileinfo.attributes.mode));
        return childNode;
    }

    buildPathFromRoot(subtree: TreeNode | undefined): string {
        if (subtree) {
            const parentName = this.buildPathFromRoot(subtree.parent);
            if (parentName) {
                if (parentName !== '/') {
                    return parentName + '/' + this.getName(subtree);
                } else {
                    return '/' + this.getName(subtree);
                }
            } else {
                return this.getName(subtree);
            }
        }
        return '';
    }

    getPathFromRoot(subtree: TreeNode | undefined, subpath: string | undefined = undefined): string {
        let path = this.buildPathFromRoot(subtree);
        if (subpath) {
            path += '/' + subpath;
        }
        if (subtree && (<TreeNodeData>this.getRoot(subtree).data).virtual) {
            return this.denormalize(path);
        }
        return path;
    }

    getRoot(subtree: TreeNode): TreeNode {
        if (subtree.parent) {
            return this.getRoot(subtree.parent);
        }
        return subtree;
    }

    createFileRows(subtree: TreeNode, needUpdate: boolean = false): FileRow[] {
        (<TreeNodeData>subtree.data).files = [];
        const list: FileRow[] = (<TreeNodeData>subtree.data).files;
        if (subtree.parent) {
            list.push(new FileRow(subtree.parent, '..', true, '', ''));
        }
        (<TreeNodeData>subtree.data).needUpdate = needUpdate;
        return list;
    }

    sortFileRows(rows: FileRow[]): void {
        rows.sort((a: FileRow , b: FileRow): number => {
            const av = a.isDir ? (a.name === '..' ? -1 : 0) : 1;
            const bv = b.isDir ? 0 : 1;
            return av - bv;
        });
    }

    expandNode(subtree: TreeNode): void  {
        // TODO not working
        const stack: TreeNode[] = [];
        this.subtreeWalkUp(subtree, stack);
        for (let i = stack.length - 1; i >= 0; i--) {
            stack[i].expanded = true;
        }
    }

    subtreeWalkUp(subtree: TreeNode, stack: TreeNode[]): void {
        // not working if no parent, parent exist only if tree node was displayed under other node
        stack.push(subtree);
        if (subtree.parent) {
            this.subtreeWalkUp(subtree.parent, stack);
        }
    }

    getName(subtree: TreeNode): string {
        const label: any = subtree.label;
        return <string>label;
    }

    isNode(subtree: TreeNode, name: string): boolean {
        return this.getName(subtree) === name;
    }

    showError(err: string): void {
        this.errorMessages.push({severity: 'error', summary: 'Error', detail: err});
    }

    newFolderNode(label: string, fileInfo: FTAFileInfo | undefined = undefined): TreeNode {
        return {'label': label, 'data': new TreeNodeData(fileInfo, true), expandedIcon: 'fa fa-folder-open',
        collapsedIcon: 'fa fa-folder', children: []};
    }

    addChild(current: TreeNode, child: TreeNode): void {
        if (!current.children) {
            current.children = [];
        }
        current.children.push(child);
        child.parent = current;
    }

    isWindowsPath(path: string): boolean {
        return path.indexOf(':\\') > 0;
    }

    // Normalize input path
    normalize(path: string): string {
        path = path.replace(/:\\/g, '/');
        path = path.replace(/\\/g, '/');
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        return path;
    }

    denormalize(path: string): string {
        path = path.substr(1, path.length - 1); // remove first /
        const driveLetter = path.substr(0, 1);
        path = path.substr(1, path.length - 1); // remove driveLetter
        if (path.length > 1) {
            path = path.substr(1, path.length - 1); // and slash
        }
        path = path.replace(/\//g, '\\');
        if (driveLetter) {
            return driveLetter + ':\\' +  path;
        } else {
            return '/';
        }
    }

    // Populates the treenode list for the p-tree
    ensurePath(tree: TreeNode[], path: string): TreeNode {
        this.log.debug('ensurePath ' + path);
        let root: TreeNode;
        if (tree.length > 0) {
            root = tree[0];
        } else {
            tree.push(root = this.newFolderNode('/'));
            if (this.isWindowsPath(path)) {// or impliment multiple roots for windows?
                (<TreeNodeData>root.data).virtual = true;
            }
        }
        root.expanded = true;

        path = this.normalize(path);
        if (path === '/') {
            return root;
        }
        const pathParts: string[] = path.split('/');
        let current: TreeNode = root;
        for (let i = 1; i < pathParts.length; i++) {
            const pathPart: string = pathParts[i];
            if (!pathPart) {// skip empty space
                continue;
            }
            let child: TreeNode | undefined = this.getChildNode(current, pathPart);
            if (!child) {
                child = this.newFolderNode(pathPart);
                this.addChild(current, child);
            }
            current = child;
            current.expanded = true;
        }
        return current;
    }

    getChildNode(subtree: TreeNode, name: string): TreeNode | undefined {
        if (subtree.children) {
            for (let i = 0; i < subtree.children.length; i++) {
                const child: TreeNode = subtree.children[i];
                if (this.isNode(child, name)) {
                    return child;
                }
            }
        }
        return undefined;
    }

}