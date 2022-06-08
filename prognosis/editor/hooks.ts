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
	});
}
