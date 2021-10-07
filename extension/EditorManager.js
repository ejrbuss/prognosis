const vscode = require('vscode');

module.exports.activate = function(context) {
	console.log('Prognosis activation started...');

	function initializeWorkspace() {
		return true;
	}

	let sceneEditor;
	let inspector;

	function revealViews() {
		if (!sceneEditor) {
			sceneEditor = vscode.window.createWebviewPanel(
				'PrognosisSceneEditor',
				'Scene Editor',
				vscode.ViewColumn.One,
				{ enableScripts: true },
			);
			sceneEditor.onDidDispose(() => sceneEditor = undefined);
		}
		if (!inspector) {
			inspector = vscode.window.createWebviewPanel(
				'PrognosisInspector',
				'Inspector',
				vscode.ViewColumn.One,
				{ enableScripts: true },
			);
			inspector.onDidDispose(() => inspector = undefined);
		}
		sceneEditor.reveal();
		inspector.reveal();
	}

	context.subscriptions.push(

		vscode.workspace.onDidChangeWorkspaceFolders(() => {
			initializeWorkspace();
		}),

		vscode.commands.registerCommand('prognosis.start', () => {
			try {
			if (initializeWorkspace()) {
				revealViews();
			}
		} catch (err) {
			console.log(err);
		}
		}),

		vscode.window.registerTreeDataProvider(
			'prognosis-scenes',
			{
				getTreeItem(element) {
					return { label: element }
				},
				getChildren(element) {
					return [ 'test 1', 'test 2' ];
				},
			}
		),
		vscode.window.registerTreeDataProvider(
			'prognosis-assets',
			{
				getTreeItem(element) {
					return { label: element }
				},
				getChildren(element) {
					return [ 'test 1', 'test 2' ];
				},
			}
		),
	);

	console.log('Prognosis activation complete.')
};