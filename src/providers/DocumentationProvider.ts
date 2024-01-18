import {
    Disposable,
    TreeDataProvider,
    EventEmitter,
    Event,
    TreeItem,
    Uri,
    env,
} from 'vscode';
import { configuration } from '../configurations';
import { getChapterLinksItems, getChaptersItems } from '../services/treeItemsService';
import Chapter from '../treeItems/Chapter';
const fs = require("fs");
const { mkdir } = require("fs/promises");
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require("path");
const express = require('express');
const app = express();
const pythonShell = require('python-shell').PythonShell;
const deploy = require('../../aitoolbox/scripts/deploy_rest');
const gitClone = require('git-clone');
const { exec } = require("child_process");


export class DocumentationProvider implements TreeDataProvider<TreeItem>, Disposable {
    private readonly _disposable: Disposable;
    private _onDidChangeTreeData: EventEmitter<Chapter | undefined | null | void> = new EventEmitter<
        Chapter | undefined | null | void
    >();
    readonly onDidChangeTreeData: Event<Chapter | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {
        this._disposable = Disposable.from(configuration.onDidChange(this.refreshDocumentation, this));
    }

    dispose() {
        this._disposable.dispose();
    }

    getTreeItem(element: Chapter): TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (element instanceof Chapter) {
            return getChapterLinksItems(element.nestedLinks);
        }
        return getChaptersItems();
    }

    refreshDocumentation() {
        this._onDidChangeTreeData.fire();
    }

    openExternalURI(link: string) {
        env.openExternal(Uri.parse(link));
    }
    
    async downloadExternalURI(link: string, filename: string){     
        const res = await fetch(link);
        const destination = path.resolve("./", filename);
        console.log(destination);
        const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
        
    }

    async runScript(ipynbFilePath: string,targetDir: string,toolDir: string, aitoolboxDir: string) {
        try{
            await deploy(ipynbFilePath, targetDir, toolDir, aitoolboxDir);}
        catch(err){
            console.log(err);
        }
    }

    gitClone(repoUrl:string, destination:string) {
        console.log(repoUrl, destination);        
        exec("cd " + destination + "&& git clone " + repoUrl, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}
