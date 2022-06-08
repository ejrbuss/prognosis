export function useRerender() {
	const [_, rerender] = React.useState({});
	return () => rerender({});
}
