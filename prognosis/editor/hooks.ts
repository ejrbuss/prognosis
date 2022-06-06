import { Storeable } from "../data/store.js";
import { Node } from "../nodes/node.js";
import { Runtime } from "../runtime.js";
import { ModelChanges } from "./model.js";

export function usePersistentState<Type extends Storeable>(
	key: string,
	defaultValue: Type
): [Type, (newState: Type) => void] {
	const [state, setState] = React.useState(defaultValue);
	React.useEffect(() => {
		const storageValue = localStorage.getItem(key);
		if (storageValue !== null) {
			setState(JSON.parse(storageValue));
		}
	}, []);
	return [
		state,
		(newState: Type) => {
			localStorage.setItem(key, JSON.stringify(newState));
			setState(newState);
		},
	];
}

export function useRoot(): Node | undefined {
	const [_, forceUpdate] = React.useState({});
	React.useEffect(() => {
		const token = ModelChanges.treeChange.connect(() => forceUpdate({}));
		return () => {
			ModelChanges.treeChange.disconnect(token);
		};
	}, []);
	return Runtime.root;
}
