// import { Entity } from "../core.js";

// type EditorExplorerProps = {
// 	root?: Entity;
// };

// export class EditorExplorer {
// 	$container = document.getElementById("explorer-container") as HTMLElement;

// 	update(props: EditorExplorerProps) {
// 		if (props.root === undefined) {
// 			this.$container.innerHTML = `
// 				<div class="empty-hint">
// 					<ion-icon size="large" name="document-outline"></ion-icon>
// 					<p>Open an entity file to get started</p>
// 				</div>`;
// 			return;
// 		}
// 		this.$container.innerHTML = this.treeView(props.root);
// 	}

// 	treeView(entity: Entity): string {
// 		return `<li class="explorer-node">
// 			<ion-icon class="explorer-icon" name="chevron-forward-outline"></ion-icon>
// 			<span class="explorer-name">${entity.name}</span>
// 		</li>`;
// 	}
// }
