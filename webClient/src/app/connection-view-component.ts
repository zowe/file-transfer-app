
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { Component, OnInit } from '@angular/core';
//import { Angular2InjectionTokens } from 'pluginlib/inject-resources';

import {TreeNode} from 'primeng/api';

import { FTAWebsocketService } from './services/FTAWebsocket.service';
import { Connection } from './Connection';
import { FTASide, FTAFileInfo, FTAFileMode, FTABinaryData } from '../../../common/FTATypes';
import { Message } from 'primeng/components/common/api';
import {MenuItem} from 'primeng/primeng';//'primeng/api';

class TreeNodeData {
    constructor(attributes: any, needUpdate: boolean) {
        this.attributes = attributes;
        this.needUpdate = needUpdate;
    }
    attributes: any;
    needUpdate: boolean;
    virtual: boolean;
    files: FileRow[];
}

class FileRow {
    constructor(treeNode: TreeNode, name: string, isDir: boolean, size: string, attributes: string) {
        this.treeNode = treeNode;
        this.name = name;
        this.isDir = isDir;
        this.size = size;
        this.attributes = attributes;
    }
    treeNode: TreeNode;
    name: string;
    isDir: boolean;
    size: string;
    attributes: string;
    isEditable: boolean = false;
    nameBackup: string;
}

@Component({
    selector: 'connection-view-component',
    templateUrl: './connection-view-component.html',
    styleUrls: ['../../node_modules/primeng/resources/primeng.min.css',
                '../../node_modules/primeng/resources/themes/omega/theme.css',
                './connection-view-component.css'
                ],
    providers: [FTAWebsocketService],
    inputs: ["connection"]
  })
export class ConnectionViewComponent implements OnInit {
    connection: Connection;

    get sideLocal() {
        return FTASide.LOCAL;
    }
    get sideRemote() {
        return FTASide.REMOTE;
    }

    currentProgress: number;

    leftPath: string;
    rightPath: string;

    leftTree: TreeNode[] = [];
    rightTree: TreeNode[] = [];
    
    leftTreeSelectedNode: TreeNode;
    rightTreeSelectedNode: TreeNode;

    leftList: FileRow[];
    rightList: FileRow[];

    rightListSelection: FileRow;
    leftListSelection: FileRow;

    contextSide: FTASide;
    contextTreeNode: TreeNode;
    contextRow: FileRow;

    displayNewDirectoryDialog: boolean;
    newDirectoryName: string
    onNewDirectoryOk(): void {
        this.displayNewDirectoryDialog = false;
        var pathToCrate = this.getPathFromRoot(this.contextTreeNode, this.newDirectoryName);
        this.md(this.contextSide, pathToCrate);
    }
    onNewDirectoryCancel(): void {
        this.displayNewDirectoryDialog = false;
    }

    displayConfirmDialog: boolean;
    confirmMessage: string;
    confirmAction: any;
    onConfirmOk(): void {
        this.confirmAction();
        this.displayConfirmDialog = false;
        this.confirmAction = null;
    }
    onConfirmCancel(): void {
        this.displayConfirmDialog = false;
    }

    displayProcessDialog: boolean;
    progressValue: number;

    //TODO optimize menus
    //left Tree Menu begin:
    leftTreeMenu: MenuItem[] = [
        {
            label: 'console Print',
            icon: 'fa fa-terminal',
            command: (event) => {
                console.log('Left Tree Print: ' + this.getName(this.leftTreeSelectedNode));

                
                
            }
        },
        {
            label: 'Refresh',
            icon: 'fa fa-refresh',
            command: (event) => {
                console.log('Left Tree Refresh: ' + this.getName(this.leftTreeSelectedNode));
                var subtreeToRefresh: TreeNode = this.leftTreeSelectedNode;
                if (!this.isFolder(subtreeToRefresh)) {
                    subtreeToRefresh = this.getParent(subtreeToRefresh);
                }
                this.refresh(FTASide.LOCAL, this.getPathFromRoot(subtreeToRefresh));
            }
        },
        {
            label: 'Upload',
            icon: 'fa fa-upload',//fa fa-cloud-upload
            command: (event) => {
                console.log('Left Tree Upload: ' + this.getName(this.leftTreeSelectedNode));
                if (this.isFolder(this.leftTreeSelectedNode)) {
                    //TODO ask user
                }
                
                var fromPath = this.getPathFromRoot(this.leftTreeSelectedNode);
                var toPath = this.getFolderPathFromRoot(this.rightTreeSelectedNode, this.getName(this.leftTreeSelectedNode));
                //this.fastPut(fromPath, toPath);
                this.pipeLR(fromPath, toPath);
            }
        },
        {
            label: 'Create directory...',
            icon: 'fa fa-folder',
            command: (event) => {
                console.log('Left Tree Create directory: ' + this.getName(this.leftTreeSelectedNode));
                var subtree: TreeNode = this.leftTreeSelectedNode;
                if (!this.isFolder(subtree)) {
                    subtree = this.getParent(subtree);
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.LOCAL;
                this.displayNewDirectoryDialog = true;
            }
        },
        {
            label: 'Delete',
            icon: 'fa fa-remove',
            command: (event) => {
                console.log('Left Tree Delete: ' + this.getName(this.leftTreeSelectedNode));
                var subtree: TreeNode = this.leftTreeSelectedNode;
                
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.LOCAL;
                this.confirmMessage = "Confirm deletion of ";
                this.confirmAction = () => {
                    var pathToDelete = this.getPathFromRoot(this.contextTreeNode);
                    if (this.isFolder(this.contextTreeNode)) {
                        this.rmdir(this.contextSide, pathToDelete);
                    } else {
                        this.delete(this.contextSide, pathToDelete);
                    }
                };
                this.displayConfirmDialog = true;
            }
        },
        {
            label: 'Browser Download',
            icon: 'fa fa-hdd-o',
            command: (event) => {
                console.log('Left Tree Browser Download: ' + this.getName(this.leftTreeSelectedNode));
                var subtree: TreeNode = this.leftTreeSelectedNode;
                if (this.isFolder(subtree)) {
                    //TODO warning
                    return;
                }
                this.saveFile(FTASide.LOCAL, this.getPathFromRoot(subtree), this.getName(subtree));
            }
        }
    ];
    //end left Tree Menu


    //right tree menu begin:
    rightTreeMenu: MenuItem[] = [
        {
            label: 'console Print',
            icon: 'fa fa-terminal',
            command: (event) => {
                console.log('Right Tree Print: ' + this.getName(this.rightTreeSelectedNode));
            }
        },
        {
            label: 'Refresh',
            icon: 'fa fa-refresh',
            command: (event) => {
                console.log('Right Tree Refresh: ' + this.getName(this.rightTreeSelectedNode));
                var subtreeToRefresh: TreeNode = this.rightTreeSelectedNode;
                if (!this.isFolder(subtreeToRefresh)) {
                    subtreeToRefresh = this.getParent(subtreeToRefresh);
                }
                this.refresh(FTASide.REMOTE, this.getPathFromRoot(subtreeToRefresh));
            }
        },
        {
            label: 'Download',
            icon: 'fa fa-download',//fa fa-cloud-download
            command: (event) => {
                console.log('Right Tree Download: ' + this.getName(this.rightTreeSelectedNode));
                var fromPath = this.getPathFromRoot(this.rightTreeSelectedNode);
                var toPath = this.getFolderPathFromRoot(this.leftTreeSelectedNode, this.getName(this.rightTreeSelectedNode));
                //this.fastGet(fromPath, toPath);
                this.pipeRL(fromPath, toPath);
            }
        },
        {
            label: 'Create directory...',
            icon: 'fa fa-folder',
            command: (event) => {
                console.log('Right Tree Create directory: ' + this.getName(this.rightTreeSelectedNode));
                var subtree: TreeNode = this.rightTreeSelectedNode;
                if (!this.isFolder(subtree)) {
                    subtree = this.getParent(subtree);
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.REMOTE;
                this.displayNewDirectoryDialog = true;
            }
        },
        {
            label: 'Delete',
            icon: 'fa fa-remove',
            command: (event) => {
                console.log('Right Tree Delete: ' + this.getName(this.rightTreeSelectedNode));
                var subtree: TreeNode = this.rightTreeSelectedNode;
                
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.REMOTE;
                this.confirmMessage = "Confirm deletion of ";
                this.confirmAction = () => {
                    var pathToDelete = this.getPathFromRoot(this.contextTreeNode);
                    if (this.isFolder(this.contextTreeNode)) {
                        this.rmdir(this.contextSide, pathToDelete);
                    } else {
                        this.delete(this.contextSide, pathToDelete);
                    }
                };
                this.displayConfirmDialog = true;
            }
        },
        {
            label: 'Browser Download',
            icon: 'fa fa-hdd-o',
            command: (event) => {
                console.log('Right Tree Browser Download: ' + this.getName(this.rightTreeSelectedNode));
                var subtree: TreeNode = this.rightTreeSelectedNode;
                if (this.isFolder(subtree)) {
                    //TODO warning
                    return;
                }
                this.saveFile(FTASide.REMOTE, this.getPathFromRoot(subtree), this.getName(subtree));
            }
        }
    ];
    //end right tree meny

    //left List Menu begin:
    leftListMenu: MenuItem[] = [
        {
            label: 'console Print',
            icon: 'fa fa-terminal',
            command: (event) => {
                console.log('Left List Print: ' + this.leftListSelection.name);
            }
        }, 
        {
            label: 'Refresh',
            icon: 'fa fa-refresh',
            command: (event) => {
                console.log('Left List Refresh: ' + this.leftListSelection.name);
                var subtreeToRefresh: TreeNode = this.leftListSelection.treeNode;
                if (!this.isFolder(subtreeToRefresh)) {
                    subtreeToRefresh = this.getParent(subtreeToRefresh);
                } else if (this.isUpRow(this.leftListSelection)) {
                    subtreeToRefresh = this.leftTreeSelectedNode;
                }
                this.refresh(FTASide.LOCAL, this.getPathFromRoot(subtreeToRefresh));
            }
        },
        {
            label: 'Upload',
            icon: 'fa fa-upload',//fa fa-cloud-upload
            command: (event) => {
                console.log('Left List Upload: ' + this.leftListSelection.name);
                if (this.isFolder(this.leftListSelection.treeNode)) {
                    //TODO ask user
                }
                
                var fromPath = this.getPathFromRoot(this.leftListSelection.treeNode);
                var toPath = this.getFolderPathFromRoot(this.rightTreeSelectedNode, this.leftListSelection.name);
                //this.fastPut(fromPath, toPath);
                this.pipeLR(fromPath, toPath);
            }
        },
        {
            label: 'Create directory...',
            icon: 'fa fa-folder',
            command: (event) => {
                console.log('Left List Create directory: ' + this.leftListSelection.name);
                var subtree: TreeNode = this.leftListSelection.treeNode;
                if (!this.isFolder(subtree)) {
                    subtree = this.getParent(subtree);
                } else if (this.isUpRow(this.leftListSelection)) {
                    subtree = this.leftTreeSelectedNode;
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.LOCAL;
                this.displayNewDirectoryDialog = true;
            }
        },
        {
            label: 'Delete',
            icon: 'fa fa-remove',
            command: (event) => {
                console.log('Left List Delete: ' + this.leftListSelection.name);
                var subtree: TreeNode = this.leftListSelection.treeNode;
                if (this.isUpRow(this.leftListSelection)) {
                    subtree = this.leftTreeSelectedNode;
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.LOCAL;
                this.confirmMessage = "Confirm deletion of ";
                this.confirmAction = () => {
                    var pathToDelete = this.getPathFromRoot(this.contextTreeNode);
                    if (this.isFolder(this.contextTreeNode)) {
                        this.rmdir(this.contextSide, pathToDelete);
                    } else {
                        this.delete(this.contextSide, pathToDelete);
                    }
                };
                this.displayConfirmDialog = true;
            }
        },
        {
            label: 'Rename',
            icon: 'fa fa-i-cursor',
            command: (event) => {
                console.log('Left List Rename: ' + this.leftListSelection.name);
                var row: FileRow = this.leftListSelection;
                row.nameBackup = row.name;
                row.isEditable = true;
                this.contextSide = FTASide.LOCAL;
            }
        },
        {
            label: 'Browser Download',
            icon: 'fa fa-hdd-o',
            command: (event) => {
                console.log('Left List Browser Download: ' + this.leftListSelection.name);
                var subtree: TreeNode = this.leftListSelection.treeNode;
                if (this.isFolder(subtree)) {
                    //TODO warning
                    return;
                }
                this.saveFile(FTASide.LOCAL, this.getPathFromRoot(subtree), this.getName(subtree));
            }
        }
    ];
    //end left List Menu


    //rightListMenu begin:
    rightListMenu: MenuItem[] = [
        {
            label: 'console Print',
            icon: 'fa fa-terminal',
            command: (event) => {
                console.log('Right List Print: ' + this.rightListSelection.name);
            }
        },
        {
            label: 'Refresh',
            icon: 'fa fa-refresh',
            command: (event) => {
                console.log('Right List Refresh: ' + this.rightListSelection.name);
                var subtreeToRefresh: TreeNode =  this.rightListSelection.treeNode;
                if (!this.isFolder(subtreeToRefresh)) {
                    subtreeToRefresh = this.getParent(subtreeToRefresh);
                } else if (this.isUpRow(this.rightListSelection)) {
                    subtreeToRefresh = this.rightTreeSelectedNode;
                }
                this.refresh(FTASide.REMOTE, this.getPathFromRoot(subtreeToRefresh));
            }
        },
        {
            label: 'Download',
            icon: 'fa fa-download',//fa fa-cloud-download
            command: (event) => {
                console.log('Right List Download: ' + this.rightListSelection.name);
                var fromPath = this.getPathFromRoot(this.rightListSelection.treeNode);
                var toPath = this.getFolderPathFromRoot(this.leftTreeSelectedNode, this.rightListSelection.name);
                //this.fastGet(fromPath, toPath);
                this.pipeRL(fromPath, toPath)
            }
        },
        {
            label: 'Create directory...',
            icon: 'fa fa-folder',
            command: (event) => {
                console.log('Right List Create directory: ' + this.rightListSelection.name);
                var subtree: TreeNode = this.rightListSelection.treeNode;
                if (!this.isFolder(subtree)) {
                    subtree = this.getParent(subtree);
                } else if (this.isUpRow(this.rightListSelection)) {
                    subtree = this.rightTreeSelectedNode;
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.REMOTE;
                this.displayNewDirectoryDialog = true;
            }
        },
        {
            label: 'Delete',
            icon: 'fa fa-remove',
            command: (event) => {
                console.log('Right List Delete: ' + this.rightListSelection.name);
                var subtree: TreeNode = this.rightListSelection.treeNode;
                if (this.isUpRow(this.rightListSelection)) {
                    subtree = this.rightTreeSelectedNode;
                }
                this.contextTreeNode = subtree;
                this.contextSide = FTASide.REMOTE;
                this.confirmMessage = "Confirm deletion of ";
                this.confirmAction = () => {
                    var pathToDelete = this.getPathFromRoot(this.contextTreeNode);
                    if (this.isFolder(this.contextTreeNode)) {
                        this.rmdir(this.contextSide, pathToDelete);
                    } else {
                        this.delete(this.contextSide, pathToDelete);
                    }
                };
                this.displayConfirmDialog = true;
            }
        },
        {
            label: 'Rename',
            icon: 'fa fa-i-cursor',
            command: (event) => {
                console.log('Left List Rename: ' + this.rightListSelection.name);
                var row: FileRow = this.rightListSelection;
                row.nameBackup = row.name;
                row.isEditable = true;
                this.contextSide = FTASide.REMOTE;
            }
        },
        {
            label: 'Browser Download',
            icon: 'fa fa-hdd-o',
            command: (event) => {
                console.log('Right List Browser Download: ' + this.rightListSelection.name);
                var subtree: TreeNode = this.rightListSelection.treeNode;
                if (this.isFolder(subtree)) {
                    //TODO warning
                    return;
                }
                this.saveFile(FTASide.REMOTE, this.getPathFromRoot(subtree), this.getName(subtree));
            }
        }
    ];
    //end rightListMenu


    errorMessages: Message[] = [];
    showError(err: string): void {
        this.errorMessages.push({severity: 'error', summary: 'Error', detail: err});
    }
    
    constructor() {
    }

    ngOnInit() {
        console.log('ngOnInit this.connection.name=' + this.connection.name);
        this.connection.ftaWs.onError((err) => {
            //this.errorMessages.pop();
            this.showError(err);
        });
        this.connection.ftaWs.onHomePath((err: any, system: FTASide, path: string) => {
            console.log('FTA onHomePath system= ' + system + ' path=' + path);
            if (err) {
                this.showError(err);
                return;
            }
            if (system === FTASide.REMOTE) {
                this.rightPath = path;
                this.rightTreeSelectedNode = this.ensurePath(this.rightTree, path);
                this.expandNode(this.rightTreeSelectedNode);
                this.connection.ftaWs.ls(FTASide.REMOTE, path);
            } else {
                this.leftPath = path;
                this.leftTreeSelectedNode = this.ensurePath(this.leftTree, path);
                this.expandNode(this.leftTreeSelectedNode);
                this.connection.ftaWs.ls(FTASide.LOCAL, path);
            }
        });
        this.connection.ftaWs.onLs((err: any, system: FTASide, path: string, fileInfos: FTAFileInfo[]) => {
            console.log('FTA onLs system= ' + system + ' path=' + path + ' ' + JSON.stringify(fileInfos));
            if (err) {
                this.showError(err);
                return;
            }
            if (system === FTASide.REMOTE) {
                let node : TreeNode = this.ensurePath(this.rightTree, path);
                this.rightList = this.createFileRows(node);
                this.cleanChildren(node);
                fileInfos.forEach(fileinfo => {
                    this.getOrCreateChildNode(node, fileinfo.name, fileinfo);
                });
                this.sortFileRows(this.rightList);
                this.rightPath = this.getPathFromRoot(node);
                this.rightTreeSelectedNode = node;
                this.expandNode(this.rightTreeSelectedNode);
            } else {
                let node : TreeNode = this.ensurePath(this.leftTree, path);
                this.leftList = this.createFileRows(node);
                this.cleanChildren(node);
                fileInfos.forEach(fileinfo => {
                    this.getOrCreateChildNode(node, fileinfo.name, fileinfo);
                });
                this.sortFileRows(this.leftList);
                this.leftPath = this.getPathFromRoot(node);
                this.leftTreeSelectedNode = node;
                this.expandNode(this.leftTreeSelectedNode);
            }
        });
        this.connection.ftaWs.getHomePath(FTASide.LOCAL);
        if (this.connection.ftaWs.remoteConnected) {
            this.connection.ftaWs.getHomePath(FTASide.REMOTE);
        }
        this.connection.ftaWs.onFastPut((err, progress) => {
            if (err) {
                this.showError(err);
                return;
            }
            console.log('onFastPut progress=' + progress);
        });
        this.connection.ftaWs.onFastGet((err, progress) => {
            if (err) {
                this.showError(err);
                return;
            }
            console.log('onFastGet progress=' + progress);
        });
        this.connection.ftaWs.onMd((err, side: FTASide, path: string, fileinfo: FTAFileInfo) => {
            if (err) {
                this.showError(err);
                return;
            }
            console.log('onMd side=' + side + ' path=' + path);
            var node: TreeNode;
            if (side == FTASide.LOCAL) {
                node = this.ensurePath(this.leftTree, path);
            } else {
                node = this.ensurePath(this.rightTree, path);
            }
            var parentNode = this.getParent(node);
            var fileRows: FileRow[] = this.getOrCreateFileRows(parentNode, true);
            var newRow = new FileRow(node, fileinfo.name, true, ''+fileinfo.attributes.size, ''+fileinfo.attributes.mode);
            fileRows.push(newRow);
            if (side == FTASide.LOCAL) {
                this.leftList = [...fileRows];
                this.sortFileRows(this.leftList);
                this.leftPath = this.getPathFromRoot(parentNode);
                this.leftTreeSelectedNode = parentNode;
                this.expandNode(this.leftTreeSelectedNode);
            } else {
                this.rightList = [...fileRows];
                this.sortFileRows(this.rightList);
                this.rightPath = this.getPathFromRoot(parentNode);
                this.rightTreeSelectedNode = parentNode;
                this.expandNode(this.rightTreeSelectedNode);
            }
        });
        this.connection.ftaWs.onDelete((err: any, side: FTASide, path: string) => {
            if (err) {
                this.showError(err);
                return;
            }
            console.log('onDelete side=' + side + ' path=' + path);
            var node: TreeNode;
            if (side == FTASide.LOCAL) {
                node = this.ensurePath(this.leftTree, path);
            } else {
                node = this.ensurePath(this.rightTree, path);
            }
            var parentNode = this.getParent(node);
            this.removeChildNode(parentNode, node);
            this.removeFileRows(parentNode, node);
            var fileRows: FileRow[] = this.getOrCreateFileRows(parentNode, true);
            if (side == FTASide.LOCAL) {
                this.leftList = [...fileRows];
            } else {
                this.rightList = [...fileRows];
            }
        });
        this.connection.ftaWs.onRename((err: any, side: FTASide, oldPath: string, newPath: string) => {
            if (err) {
                this.showError(err);
                this.contextRow.name = this.contextRow.nameBackup;
                return;
            }
            console.log('onRename side=' + side + ' oldPath=' + oldPath + ' newPath=' + newPath);
            var node: TreeNode;
            if (side == FTASide.LOCAL) {
                node = this.ensurePath(this.leftTree, oldPath);
            } else {
                node = this.ensurePath(this.rightTree, oldPath);
            }
            var newPathParts = this.parsePath(newPath);
            var newName = newPathParts[newPathParts.length - 1];
            this.renameNode(node, newName);
        });
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');
        this.connection.ftaWs.disconnect();
    }

    newNode(label: string, fileInfo: FTAFileInfo | undefined = undefined): TreeNode {
        if (fileInfo && fileInfo.attributes && fileInfo.attributes.isDirectory) {
            return this.newFolderNode(label, fileInfo);
        } else {
            return {"label": label, "data": new TreeNodeData(fileInfo, false), icon: "fa fa-file"};
        }
    }

    newFolderNode(label: string, fileInfo: FTAFileInfo | undefined = undefined): TreeNode {
        return {"label": label, "data": new TreeNodeData(fileInfo, true), expandedIcon: "fa fa-folder-open", collapsedIcon: "fa fa-folder", children: []};
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

    normalize(path: string): string {
        path = path.replace(/:\\/g, '/');
        path = path.replace(/\\/g, '/');
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        return path;
    }

    denormalize(path: string): string {
        path = path.substr(1, path.length - 1);//remove first /
        let driveLetter = path.substr(0, 1);
        path = path.substr(1, path.length - 1);//remove driveLetter
        if (path.length > 1) {
            path = path.substr(1, path.length - 1);//and slash
        }
        path = path.replace(/\//g, '\\');
        if (driveLetter) {
            return driveLetter + ':\\' +  path;
        } else {
            return '/';
        }
    }

    parsePath(path: string): string[] {
        path = this.normalize(path);
        let pathParts: string[] = path.split('/');
        let result: string[] = [];
        for (let i = 1; i < pathParts.length; i++) {
            let pathPart: string = pathParts[i];
            if (!pathPart) {//skip empty space
                continue;
            }
            result.push(pathPart);
        }
        return result;
    }

    ensurePath(tree: TreeNode[], path: string): TreeNode {
        console.log('ensurePath ' + path);
        let root: TreeNode;
        if (tree.length > 0) {
            root = tree[0];
        } else {
            tree.push(root = this.newFolderNode('/'));
            if (this.isWindowsPath(path)) {//or impliment multiple roots for windows?
                (<TreeNodeData>root.data).virtual = true;
            }
        }
        root.expanded = true;

        path = this.normalize(path);
        if (path == '/') {
            return root;
        }
        
        let pathParts: string[] = path.split('/');
        
        let current: TreeNode = root;
        for (let i = 1; i < pathParts.length; i++) {
            let pathPart: string = pathParts[i];
            if (!pathPart) {//skip empty space
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

    expandNode(subtree: TreeNode): void  {
        //TODO not working
        var stack: TreeNode[] = [];
        this.subtreeWalkUp(subtree, stack);
        for (var i = stack.length - 1; i >= 0; i--) {
            stack[i].expanded = true;
        }
    }

    subtreeWalkUp(subtree: TreeNode, stack: TreeNode[]) {
        //not working if no parent, parent exist only if tree node was displayed under other node
        stack.push(subtree);
        if (subtree.parent) {
            this.subtreeWalkUp(subtree.parent, stack);
        }
    }

    getName(subtree: TreeNode): string {
        let label: any = subtree.label;
        return <string>label;
    }

    isNode(subtree: TreeNode, name: string) {
        return this.getName(subtree) === name;
    }

    getRoot(subtree: TreeNode): TreeNode {
        if (subtree.parent) {
            return this.getRoot(subtree.parent);
        }
        return subtree;
    }

    getParent(subtree: TreeNode): TreeNode {
        if (subtree.parent) {
            return subtree.parent;
        }
        return subtree;
    }

    buildPathFromRoot(subtree: TreeNode | undefined): string {
        if (subtree) {
            let parentName = this.buildPathFromRoot(subtree.parent);
            if (parentName) {
                if (parentName != '/') {
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

    getFolderPathFromRoot(subtree: TreeNode | undefined, subpath: string | undefined = undefined): string {
        if (subtree && !this.isFolder(subtree)) {
            subtree = this.getParent(subtree);
        }
        return this.getPathFromRoot(subtree, subpath);
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

    isFolder(subtree: TreeNode): boolean {
        if (subtree.data && (<TreeNodeData>subtree.data).attributes) {
            return (<FTAFileInfo>(<TreeNodeData>subtree.data).attributes).attributes.isDirectory;
        }
        return !!subtree.children;
    }

    needUpdate(subtree: TreeNode): boolean {
        return (<TreeNodeData>subtree.data).needUpdate;
    }

    cleanChildren(subtree: TreeNode): void {
        delete subtree.children;
    }

    getChildNode(subtree: TreeNode, name: string): TreeNode | undefined {
        if (subtree.children) {
            for (let i = 0; i < subtree.children.length; i++) {
                let child: TreeNode = subtree.children[i];
                if (this.isNode(child, name)) {
                    return child;
                }
            }
        }
        return undefined;
    }

    getOrCreateChildNode(subtree: TreeNode, name: string, fileinfo: FTAFileInfo): TreeNode | undefined {
        var childNode = this.getChildNode(subtree, name);
        if (!childNode) {
            this.addChild(subtree, childNode = this.newNode(name, fileinfo));
        }
        (<TreeNodeData>subtree.data).files.push(new FileRow(childNode, fileinfo.name, fileinfo.attributes.isDirectory, ''+fileinfo.attributes.size, ''+fileinfo.attributes.mode));
        return childNode;
    }

    sortFileRows(rows: FileRow[]): void {
        rows.sort((a: FileRow , b: FileRow): number => {
            var av = a.isDir ? (a.name == '..'?-1:0) : 1;
            var bv = b.isDir ? 0 : 1;
            return av - bv;
        });
    }

    isUpRow(row: FileRow): boolean {
        return row.isDir && row.name == '..';
    }

    createFileRows(subtree: TreeNode, needUpdate: boolean = false): FileRow[] {
        (<TreeNodeData>subtree.data).files = [];
        var list: FileRow[] = (<TreeNodeData>subtree.data).files;
        if (subtree.parent) {
            list.push(new FileRow(subtree.parent, '..', true, '', ''));
        }
        (<TreeNodeData>subtree.data).needUpdate = needUpdate;
        return list;
    }

    getOrCreateFileRows(subtree: TreeNode, needUpdate: boolean = false): FileRow[] {
        if (!(<TreeNodeData>subtree.data).files) {
            return this.createFileRows(subtree, needUpdate);
        }
        return (<TreeNodeData>subtree.data).files;
    }

    removeChildNode(parentNode: TreeNode, node: TreeNode): void {
        if (parentNode.children) {
            parentNode.children.splice(parentNode.children.indexOf(node), 1);
        }
    }

    removeFileRows(parentNode: TreeNode, node: TreeNode): void {
        var list: FileRow[] = (<TreeNodeData>parentNode.data).files;
        if (list) {
            var index = -1;
            list.find((value: FileRow, i: number) => {
                index = i;
                return value.name == this.getName(node);
            });
            list.splice(index, 1);
        }
    }

    renameNode(node: TreeNode, newName: string): void {
        node.label = newName;
    }

    getFileRow(node: TreeNode): FileRow | undefined {
        if (node.parent) {
            var parentNode: TreeNode = node.parent;
            var list: FileRow[] = (<TreeNodeData>parentNode.data).files;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == this.getName(node)) {
                    return list[i];
                }
            }
        }
        return undefined;
    }


    rightTreeNodeSelect(event: any): void {
        this.rightPath = this.getPathFromRoot(event.node);
        if (this.isFolder(event.node)) {
            if (this.needUpdate(event.node)) {
                this.connection.ftaWs.ls(FTASide.REMOTE, this.rightPath);
            }
            this.rightList = (<TreeNodeData>event.node.data).files;
            this.rightListSelection = this.rightList[0];
        } else {
            var row = this.getFileRow(event.node);
            if (row) {
                this.rightListSelection = row;
            } /*else {
                //TODO how to deselect?
                this.rightListSelection = null;
            }*/
        }
    }

    rightTreeNodeExpand(event: any): void {
        if(event.node) {
            console.log('rightTreeNodeExpand ' + this.getPathFromRoot(event.node));
            
        }
    }

    leftTreeNodeSelect(event: any): void {
        this.leftPath = this.getPathFromRoot(event.node);
        if (this.isFolder(event.node)) {
            if (this.needUpdate(event.node)) {
                this.connection.ftaWs.ls(FTASide.LOCAL, this.leftPath);
            }
            this.leftList = (<TreeNodeData>event.node.data).files;
            this.leftListSelection = this.leftList[0];
        } else {
            var row = this.getFileRow(event.node);
            if (row) {
                this.leftListSelection = row;
            } /*else {
                //TODO how to deselect?
                this.leftListSelection = null;
            }*/ 
        }
    }

    leftTreeNodeExpand(event: any): void {
        if(event.node) {
            console.log('leftTreeNodeExpand ' + this.getPathFromRoot(event.node));
            
        }
    }

    leftListSelect(event: any): void {
        console.log('leftListSelect ' + event.data);
        var fileRow: FileRow  = <FileRow>event.data;
        if (this.isUpRow(fileRow)) {
            this.leftTreeSelectedNode = this.getParent(this.leftTreeSelectedNode);
        } else {
            this.leftTreeSelectedNode = fileRow.treeNode;
        }
    }

    leftListRowDblclick(event: any): void {
        console.log('leftListRowDblclick ' + event.data);
        var fileRow: FileRow  = <FileRow>event.data;
        if (fileRow.isDir && fileRow.treeNode) {
            this.leftPath = this.getPathFromRoot(fileRow.treeNode);
            if (this.needUpdate(fileRow.treeNode)) {
                this.connection.ftaWs.ls(FTASide.LOCAL, this.leftPath);
            }
            this.leftTreeSelectedNode = fileRow.treeNode;
            this.leftTreeSelectedNode.expanded = true;
            this.leftList = (<TreeNodeData>this.leftTreeSelectedNode.data).files;
        }
    }

    rightListSelect(event: any): void {
        console.log('rightListSelect ' + event.data);
        var fileRow: FileRow  = <FileRow>event.data;
        if (this.isUpRow(fileRow)) {
            this.rightTreeSelectedNode = this.getParent(this.rightTreeSelectedNode);
        } else {
            this.rightTreeSelectedNode = fileRow.treeNode;
        }
    }

    rightListRowDblclick(event: any): void {
        console.log('rightListRowDblclick ' + event.data);
        var fileRow: FileRow  = <FileRow>event.data;
        if (fileRow.isDir && fileRow.treeNode) {
            this.rightPath = this.getPathFromRoot(fileRow.treeNode);
            if (this.needUpdate(fileRow.treeNode)) {
                this.connection.ftaWs.ls(FTASide.REMOTE, this.rightPath);
            }
            this.rightTreeSelectedNode = fileRow.treeNode;
            this.rightTreeSelectedNode.expanded = true;
            this.rightList = (<TreeNodeData>this.rightTreeSelectedNode.data).files;
        }
    }

    rowDataInputEnter(row: FileRow) {
        console.log('rowDataInputEnter on ' + row.nameBackup + ' -> ' + row.name);
        this.contextRow = row;
        row.isEditable = false;
        var newName = row.name;
        var node = row.treeNode;
        var pathToRename: string = this.getPathFromRoot(node);
        var parentNode = this.getParent(node);
        var newPath: string = this.getPathFromRoot(parentNode, newName);
        this.rename(this.contextSide, pathToRename, newPath);
    }

    rowDataInputEscape(row: FileRow): void {
        console.log('rowDataInputEscape on ' + row.nameBackup);
        row.name = row.nameBackup;
        row.isEditable = false;
        delete this.contextRow;
    }



    onContextShow(event?: MouseEvent): void {
        console.log('onContextShow');//not working
    }


    fastPut(fromPath: string, toPath: string): void {
        console.log('fastPut path: ' + fromPath + ' to ' + toPath);
        this.connection.ftaWs.fastPut(fromPath, toPath);
    }

    refresh(side: FTASide, path: string): void {
        this.connection.ftaWs.ls(side, path);
    }
    
    fastGet(fromPath: string, toPath: string): void {
        console.log('fastGet path: ' + fromPath + ' to ' + toPath);
        this.connection.ftaWs.fastGet(fromPath, toPath);
    }

    md(side: FTASide, pathToCrate: string): void {
        console.log('md side=' + side + ' pathToCrate=' + pathToCrate);
        this.connection.ftaWs.md(side, pathToCrate);
    }

    delete(side: FTASide, pathToDelete: string): void {
        console.log('delete side=' + side + ' pathToDelete=' + pathToDelete);
        this.connection.ftaWs.delete(side, pathToDelete);
    }

    rmdir(side: FTASide, pathToDelete: string): void {
        console.log('rmdir side=' + side + ' pathToDelete=' + pathToDelete);
        this.connection.ftaWs.rmdir(side, pathToDelete);
    }

    rename(side: FTASide, pathToRename: string, newPath: string): void {
        console.log('rename side=' + side + ' pathToRename=' + pathToRename + ' newPath=' + newPath);
        this.connection.ftaWs.rename(side, pathToRename, newPath);
    }

    fopen(side: FTASide, pathToOpen: string, mode: FTAFileMode, onOpen: (err: any, streamId: number) => void): void {
        console.log('fopen side=' + side + ' pathToOpen=' + pathToOpen + ' mode=' + mode);
        this.connection.ftaWs.fopen(side, pathToOpen, mode, onOpen);
    }

    fclose(side: FTASide, streamId: number, mode: FTAFileMode, errHandler: (err: any) => void): void {
        console.log('fclose side=' + side + ' streamId=' + streamId + ' mode=' + mode);
        this.connection.ftaWs.fclose(side, streamId, mode, errHandler);
    }

    uploadHandler(event: any, uploadObject: any, side: FTASide, progressHandler?: (percent: number) => void): void {
        console.log('uploadHandler ' + event);
        var name = event.files[0].name;
        var fileBlob: Blob = event.files[0];
        var sideCode = side == FTASide.LOCAL ? 0 : 1;
        var subtree = side == FTASide.LOCAL ? this.leftTreeSelectedNode : this.rightTreeSelectedNode;
        this.fopen(side, this.getPathFromRoot(subtree, name), FTAFileMode.write, (err, streamId) => {
            if (err) {
                this.showError(err);
                if (progressHandler) {
                    progressHandler.apply(this, [0]);
                }
                return;
            }

            this.readFile(fileBlob, 65531, (chunk, offset, next) => {
                console.log('send binary length=' + chunk.byteLength);
                if (progressHandler) {
                    progressHandler.apply(this, [offset / fileBlob.size]);
                }
                return this.connection.ftaWs.sendBinary(sideCode, streamId, chunk, (err, length) => {
                    if (err) {
                        this.showError(err);
                        if (progressHandler) {
                            progressHandler.apply(this, [0]);
                        }
                        return;
                    }
                    console.log('sent binary length=' + length);
                    next();
                });
            }, (err) => {
                console.log('read file complete ' + err);
                if (err) {
                    this.showError(err);
                    if (progressHandler) {
                        progressHandler.apply(this, [0]);
                    }
                    return;
                }
                this.fclose(side, streamId, FTAFileMode.write, (err) => {
                    if (err) {
                        this.showError(err);
                    }
                });
                uploadObject.clear();
                //fileBlob .close();//how to close blob?
                if (progressHandler) {
                    progressHandler.apply(this, [1]);
                }
            });
        });
    }

    readFile(fileBlob: Blob, chunkSize: number, onChunk: (chunk: ArrayBuffer, offset: number, next: ()=>void) => boolean, onComplete: (err?: any) => void) {
        var offset: number = 0;
        var fileReader: FileReader = new FileReader();
        fileReader.onload = () => {
            var data = fileReader.result;
            var length = data.byteLength;
            if (length <= 0) {
                console.log('zero chunk lenght');
                return onComplete();
            }
            console.log('file chunk lenght' + length);
            onChunk(data, offset, () => {
                offset += length;
                this.readFileChunk(fileBlob, offset, chunkSize, onComplete, fileReader); 
            });
        };
        fileReader.onerror = (err) => {
            onComplete(err);
        };
        this.readFileChunk(fileBlob, offset, chunkSize, onComplete, fileReader);
    }

    readFileChunk(fileBlob: Blob, offset: number, chunkSize: number, onComplete: (err?: any) => void, fileReader: FileReader) {
        var start = offset;
        if (start >= fileBlob.size) {
            return onComplete();
        }
        var end = offset + chunkSize;
        if (end >= fileBlob.size) {
            end = fileBlob.size;
        }
        var slice: Blob = fileBlob.slice(start, end);
        fileReader.readAsArrayBuffer(slice);
    }

    uploadHandlerProgress(percent: number): void {
        console.log('percent=' + percent);
        this.progressValue = percent * 100;
        this.currentProgress = Math.round(percent * 100);
        if (percent > 0 && percent < 1) {
            this.displayProcessDialog = true;
        } else {
            this.displayProcessDialog = false;
        }
    }

    
    saveAs(blob: Blob, filename: string): void {
        console.log('saveAs filename=' + filename + ' blob.size=' + blob.size);
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    saveFile(side: FTASide, filePath: string, filename: string): void {
        var contentType = 'application/octet-stream';
        var blob = new Blob([], {'type':contentType});
        this.downloadFile(side, filePath, (chunk) => {
            console.log('downloadFile chunk ' + chunk.byteLength);
            blob = new Blob([blob, chunk], {'type':contentType});
        }, (err) => {
            console.log('downloadFile complete');
            if (err) {
                console.error(err);
            } else {
                this.saveAs(blob, filename);
            }
        });
    }

    downloadFile(side: FTASide, filePath: string, dataHandler: (chunk: ArrayBuffer) => void, completeHandler: (err: any) => void): void {
        this.fopen(side, filePath, FTAFileMode.read, (err, streamId) => {
            this.connection.ftaWs.onBinaryData(streamId, (binData: FTABinaryData) => {
                dataHandler(binData.data);
            }, () => {
                completeHandler(null);
            });
        });
    }

    pipeLR(fromPath: string, toPath: string): void {
        console.log('pipeLR path: ' + fromPath + ' to ' + toPath);
        this.connection.ftaWs.pipeLR(fromPath, toPath, (err, readStreamId, writeStreamId, chunkSize, complete) => {
            console.log('pipeLR event: ' + err + ' ' + readStreamId + ' ' + writeStreamId + ' ' + chunkSize + ' ' + complete);
        });
    }

    pipeRL(fromPath: string, toPath: string): void {
        console.log('pipeRL path: ' + fromPath + ' to ' + toPath);
        this.connection.ftaWs.pipeRL(fromPath, toPath, (err, readStreamId, writeStreamId, chunkSize, complete) => {
            console.log('pipeRL event: ' + err + ' ' + readStreamId + ' ' + writeStreamId + ' ' + chunkSize + ' ' + complete);
        });
    }

    pathFieldEnter(side: FTASide, pathEntered: string): void {
        console.log('pathFieldEnter side=' + side + ' pathEntered=' + pathEntered);
        this.connection.ftaWs.ls(side, pathEntered);
    }

    browserDownload(side: FTASide): void {
        console.log('browserDownload side=' + side);
        var subtree: TreeNode;
        if (side == FTASide.LOCAL) {
            subtree = this.leftTreeSelectedNode;
        } else {
            subtree = this.rightTreeSelectedNode;
        }
        if (subtree && !this.isFolder(subtree)) {
            this.saveFile(side, this.getPathFromRoot(subtree), this.getName(subtree));
        }
    }

    uploadBtn(uploadElement: any, side: FTASide): void {
        console.log('testUpload ' + uploadElement);
        uploadElement.basicFileInput.nativeElement.click()
    }

    fileCopyBtn(side: FTASide): void {
        console.log('fileCopyBtn side=' + side);
        if (side == FTASide.LOCAL) {
            if (!this.isFolder(this.leftTreeSelectedNode)) {
                var fromPath = this.getPathFromRoot(this.leftTreeSelectedNode);
                var toPath = this.getFolderPathFromRoot(this.rightTreeSelectedNode, this.getName(this.leftTreeSelectedNode));
                this.pipeLR(fromPath, toPath);
            }
        } else {
            if (!this.isFolder(this.rightTreeSelectedNode)) {
                var fromPath = this.getPathFromRoot(this.rightTreeSelectedNode);
                var toPath = this.getFolderPathFromRoot(this.leftTreeSelectedNode, this.getName(this.rightTreeSelectedNode));
                this.pipeRL(fromPath, toPath);
            }
        }
    }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
