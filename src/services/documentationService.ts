import fetch from 'node-fetch';
import { RootNode } from '../types';
const fs = require('fs');

export const getDocumentationConfig = async (): Promise<RootNode> => {
/*     var file = fs.readFileSync('/home/ficzere/Storage/vscode/AI_toolbox/data/data.json');
    return await JSON.parse(file); */
    const response = await fetch('https://raw.githubusercontent.com/hollosigergely/aitoolbox/master/catalogue.json');
    return await response.json() as RootNode;
};