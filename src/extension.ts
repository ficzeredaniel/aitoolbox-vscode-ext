import { window, commands, ExtensionContext } from 'vscode';
import { DocumentationProvider } from './providers/DocumentationProvider';
import { Configuration } from './configurations';

export async function activate(context: ExtensionContext) {
	const documentationProvider = new DocumentationProvider();
	window.registerTreeDataProvider('documentation-browser', documentationProvider);
	Configuration.configure(context);
	registerCommands(documentationProvider);
}

const registerCommands = (documentationProvider: DocumentationProvider) => {
/* 	commands.registerCommand('documentation-browser.openLink', node =>
		documentationProvider.openExternalURI(node.link)
	) */
/* 	commands.registerCommand('documentation-browser.download', node =>
	documentationProvider.downloadExternalURI(node.link, '/home/ficzere/Storage/vscode/AI_toolbox/test.ipynb')
	); */
	commands.registerCommand('documentation-browser.download', node =>
	documentationProvider.gitClone(node.link, '/home/ficzere/Storage/vscode/AI_toolbox_demo/')
	);
	commands.registerCommand('documentation-browser.runFalcon', node =>
	documentationProvider.runScript('/home/ficzere/Storage/vscode/AI_toolbox_demo/tool-falcon/query.ipynb', '/home/ficzere/Storage/vscode/AI_toolbox_demo/tool-falcon/deploy/', '/home/ficzere/Storage/vscode/AI_toolbox_demo/tool-falcon/', '/home/ficzere/Storage/vscode/AI_toolbox/aitoolbox/' )
	);
	commands.registerCommand('documentation-browser.runPromptCI', node =>
	documentationProvider.runScript('/home/ficzere/Storage/vscode/AI_toolbox_demo/prompt-ci/query.ipynb', '/home/ficzere/Storage/vscode/AI_toolbox_demo/prompt-ci/deploy/', '/home/ficzere/Storage/vscode/AI_toolbox_demo/prompt-ci/', '/home/ficzere/Storage/vscode/AI_toolbox/aitoolbox/' )
	);
	commands.registerCommand('documentation-browser.refreshDocumentation', () =>
		documentationProvider.refreshDocumentation()
	);
};

export function deactivate() { }
