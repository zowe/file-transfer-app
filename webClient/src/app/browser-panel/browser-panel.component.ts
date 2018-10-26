<<<<<<< HEAD
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Connection } from '../Connection';
import { Message } from 'primeng/components/common/api';
import { FTASide, FTAFileInfo, FTAFileMode } from '../../../../common/FTATypes';

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
    '../../../node_modules/carbon-components/css/carbon-components.min.css',
    '../../../node_modules/primeng/resources/primeng.min.css',
    './browser-panel.component.css'
    ],
    inputs: ['connection']
})
export class BrowserPanelComponent implements OnInit {
    @Input() connection: Connection;
    @Input() ftaSide: FTASide;

    fileView: string;

    tree: TreeNode[] = [];

    treeSelectedNode: TreeNode;

    listSelection: FileRow;

    list: FileRow[];

    leftPath: string;

    errorMessages: Message[] = [];

    contextSide: FTASide;
    contextTreeNode: TreeNode;
    contextRow: FileRow;

    constructor() { }

    get sideLocal(): FTASide {
        return FTASide.LOCAL;
    }
    get sideRemote(): FTASide {
        return FTASide.REMOTE;
    }

    ngOnInit(): void {
        console.log('ngOnInit this.connection.name=' + this.connection.name);

        this.fileView = 'tree';

        this.connection.ftaWs.onError((err) => {
            this.showError(err);
        });

        this.connection.ftaWs.onHomePath((err: any, system: FTASide, path: string) => {
            console.log('FTA onHomePath system= ' + system + ' path=' + path);
            if (err) {
                this.showError(err);
                return;
            }
            // if (system === this.ftaSide) {
                // this.rightPath = path;
                // this.rightTreeSelectedNode = this.ensurePath(this.rightTree, path);
                // this.expandNode(this.rightTreeSelectedNode);
                // this.connection.ftaWs.ls(FTASide.REMOTE, path);
            // } else {
                this.leftPath = path;
                this.treeSelectedNode = this.ensurePath(this.tree, path);
                this.expandNode(this.treeSelectedNode);
                this.connection.ftaWs.ls(this.ftaSide, path);
            // }
        });

        this.connection.ftaWs.onLs((err: any, system: FTASide, path: string, fileInfos: FTAFileInfo[]) => {
            console.log('FTA onLs system= ' + system + ' path=' + path + ' ' + JSON.stringify(fileInfos));
            if (err) {
                this.showError(err);
                return;
            }
            // if (system === FTASide.REMOTE) {
                // let node : TreeNode = this.ensurePath(this.rightTree, path);
                // this.rightList = this.createFileRows(node);
                // this.cleanChildren(node);
                // fileInfos.forEach(fileinfo => {
                //     this.getOrCreateChildNode(node, fileinfo.name, fileinfo);
                // });
                // this.sortFileRows(this.rightList);
                // this.rightPath = this.getPathFromRoot(node);
                // this.rightTreeSelectedNode = node;
                // this.expandNode(this.rightTreeSelectedNode);
            // } else {
                const node: TreeNode = this.ensurePath(this.tree, path);
                this.list = this.createFileRows(node);
                this.cleanChildren(node);
                fileInfos.forEach(fileinfo => {
                    this.getOrCreateChildNode(node, fileinfo.name, fileinfo);
                });
                this.sortFileRows(this.list);
                this.leftPath = this.getPathFromRoot(node);
                this.treeSelectedNode = node;
                this.expandNode(this.treeSelectedNode);
            // }
        });

        this.connection.ftaWs.getHomePath(this.ftaSide);
        // if (this.connection.ftaWs.remoteConnected) {
        //     this.connection.ftaWs.getHomePath(FTASide.REMOTE);
        // }
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
        console.log('fopen side=' + side + ' pathToOpen=' + pathToOpen + ' mode=' + mode);
        this.connection.ftaWs.fopen(side, pathToOpen, mode, onOpen);
    }

    // downloadFile(side: FTASide, filePath: string, dataHandler: (chunk: ArrayBuffer) => void, completeHandler: (err: any) => void): void {
    //     this.fopen(side, filePath, FTAFileMode.read, (err, streamId) => {
    //         this.connection.ftaWs.onBinaryData(streamId, (binData: FTABinaryData) => {
    //             dataHandler(binData.data);
    //         }, () => {
    //             completeHandler(null);
    //         });
    //     });
    // }

    sendTo(): void {
        
    }

    saveAs(): void {
        const tokens = this.leftPath.split('/');
        const filename = tokens[tokens.length - 1];
        console.log('saveAs filename=' + filename);
        const a = document.createElement('a');
        a.href = '/unixFileContents' + this.leftPath;
        a.download = filename;
        a.click();
    }

    // saveFile(side: FTASide, filePath: string, filename: string): void {
    //     const contentType = 'application/octet-stream';
    //     let blob = new Blob([], {'type': contentType});
    //     this.downloadFile(side, filePath, (chunk) => {
    //         console.log('downloadFile chunk ' + chunk.byteLength);
    //         blob = new Blob([blob, chunk], {'type': contentType});
    //     }, (err) => {
    //         console.log('downloadFile complete');
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             this.saveAs(blob, filename);
    //         }
    //     });
    // }

    // browserDownload(): void {
    //     const selected: TreeNode = this.treeSelectedNode;

    //     if (selected && !this.isFolder(selected)) {
    //         this.saveFile(this.ftaSide, this.getPathFromRoot(selected), this.getName(selected));
    //     }
    // }

    needUpdate(subtree: TreeNode): boolean {
        return (<TreeNodeData>subtree.data).needUpdate;
    }

    pathFieldEnter(side: FTASide, pathEntered: string): void {
        console.log('pathFieldEnter side=' + side + ' pathEntered=' + pathEntered);
        this.connection.ftaWs.ls(this.ftaSide, pathEntered);
    }

    treeNodeSelect(event: any): void {
        this.leftPath = this.getPathFromRoot(event.node);
        if (this.isFolder(event.node)) {
            if (this.needUpdate(event.node)) {
                this.connection.ftaWs.ls(this.ftaSide, this.leftPath);
            }
            this.list = (<TreeNodeData>event.node.data).files;
            this.listSelection = this.list[0];
        } else {
            const row = this.getFileRow(event.node);
            if (row) {
                this.listSelection = row;
            } /*else {
                //TODO how to deselect?
                this.listSelection = null;
            }*/
        }
    }

    treeNodeExpand(event: any): void {
        if (event.node) {
            console.log('treeNodeExpand ' + this.getPathFromRoot(event.node));
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
        console.log('listSelect ' + event.data);
        const fileRow: FileRow  = <FileRow>event.data;
        if (this.isUpRow(fileRow)) {
            this.treeSelectedNode = this.getParent(this.treeSelectedNode);
        } else {
            this.treeSelectedNode = fileRow.treeNode;
        }
    }

    listRowDblclick(event: any): void {
        console.log('listRowDblclick ' + event.data);
        const fileRow: FileRow  = <FileRow>event.data;
        if (fileRow.isDir && fileRow.treeNode) {
            this.leftPath = this.getPathFromRoot(fileRow.treeNode);
            if (this.needUpdate(fileRow.treeNode)) {
                this.connection.ftaWs.ls(this.ftaSide, this.leftPath);
            }
            this.treeSelectedNode = fileRow.treeNode;
            this.treeSelectedNode.expanded = true;
            this.list = (<TreeNodeData>this.treeSelectedNode.data).files;
        }
    }

    rowDataInputEnter(row: FileRow): void {
        console.log('rowDataInputEnter on ' + row.nameBackup + ' -> ' + row.name);
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
        console.log('rowDataInputEscape on ' + row.nameBackup);
        row.name = row.nameBackup;
        row.isEditable = false;
        delete this.contextRow;
    }

    rename(side: FTASide, pathToRename: string, newPath: string): void {
        console.log('rename side=' + side + ' pathToRename=' + pathToRename + ' newPath=' + newPath);
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
        console.log('testUpload ' + uploadElement);
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
        console.log('ensurePath ' + path);
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
=======
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browser-panel',
  templateUrl: './browser-panel.component.html',
  styleUrls: [
  '../../../node_modules/carbon-components/css/carbon-components.min.css',
  '../../../node_modules/primeng/resources/primeng.min.css',
  './browser-panel.component.css'
]
})
export class BrowserPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
>>>>>>> 2ee12eafde46e722ab3d7cbd9295cb5bd9752963

}
