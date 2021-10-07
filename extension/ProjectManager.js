const vscode = require('vscode');
const fs = require('fs/promises');

const ProjectSpec = {
	/*
	name: Spec.isString,
	version: Spec.isStriing,
	author: Spec.isString,
	initialScene: Spec.isNumber,
	renderWidth: Spec.isNumber,
	renderHeight: Spec.isNumber,
	targetId: Spec.isString,
	systems: Spec.isArrayOf(isPath),

	scenes: Spec.isArrayOf({
		id: SPec.isNumber,
		name: Spec.isString,
		layers: Spec.isArrayOf(Spec.isNumber),
		effects: Spec.isArrayOf(isPath),
		behaviiours: Spec.isArrayOf(isPath),
		camera: {
			x: 
			y:
			width:
			height:
		}
	}),

	layers: Spec.isArrayOf({
		name:
		color:
		opacity:
		effects:
		behaviours:
		objects:
	}),

	objects: Spec.isArrayOf({

	}),

	assets: Spec.isArrayOf({

	}),

	*/
};

const projectState = {};

let worksapceFolder;

async function readProjectState() {
	return JSON.parse(await fs.readFile(worksapceFolder.uri.fsPath));
}

module.exports.initialize = async () => {
	const folders = vscode.workspace.workspaceFolders;

	// There are no folders
	if (folders.length === 0) {
		vscode.window.showErrorMessage('Prognosis cannot start if no folder is open!');
		return;
	}

	// There is exactly one folder TODO check for file
	if (folders.length === 1) {
		worksapceFolder = folders[0];
		return;
	}

	// There are multiple folders
	if (folders.length > 1) {
		vscode.window.showErrorMessage('Prognosis does not currently support multtiple workspace folders!');
		return;
	}
};

module.exports.update = async projectState => {

};

module.exports.subscribe = listener => {

};