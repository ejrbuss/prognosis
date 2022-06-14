import { Signal } from "../signal.js";

export function classNames(
	...classNames: (undefined | string | Record<string, boolean | undefined>)[]
) {
	const processedClassNames = [];
	for (const className of classNames) {
		if (typeof className === "undefined") {
		} else if (typeof className === "string") {
			processedClassNames.push(className);
		} else {
			const classObject = className;
			for (const className in classObject) {
				if (classObject[className]) {
					processedClassNames.push(className);
				}
			}
		}
	}
	return processedClassNames.join(" ");
}

export function useRerender() {
	const [_, rerender] = React.useState({});
	return () => rerender({});
}

export function useInterval(time: number) {
	const rerender = useRerender();
	React.useEffect(() => {
		const id = setInterval(() => rerender(), time);
		return () => {
			clearInterval(id);
		};
	}, []);
}

export function useEventListener(
	target: HTMLElement | Window,
	event: string,
	listener: EventListener
) {
	React.useEffect(() => {
		target.addEventListener(event, listener);
		return () => {
			target.removeEventListener(event, listener);
		};
	}, []);
}

export function useSignal<Type>(signal: Signal<Type>): Type | undefined {
	const ref = React.useRef(undefined as Type | undefined);
	const rerender = useRerender();
	React.useEffect(() => {
		const token = signal.connect((value) => {
			ref.current = value;
			rerender();
		});
		return () => {
			signal.disconnect(token);
		};
	}, []);
	return ref.current;
}
