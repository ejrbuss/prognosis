export function useEventListener<EventType extends keyof WindowEventMap>(
	eventName: EventType,
	handler: EventListener,
	target: HTMLElement | Window = window
) {
	const saveHandler = React.useRef<EventListener>();
	React.useEffect(() => {
		saveHandler.current = handler;
	}, [handler]);
	React.useEffect(() => {
		const eventListener: EventListener = (event) =>
			(saveHandler.current as EventListener)(event);
		target.addEventListener(eventName, eventListener);
		return () => {
			target.removeEventListener(eventName, eventListener);
		};
	}, [eventName, target]);
}
