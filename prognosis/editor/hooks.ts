import { Storeable } from "../data/store.js";

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
