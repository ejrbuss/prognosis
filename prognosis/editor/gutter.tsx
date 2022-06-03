export type GutterProps = {
	horizontal?: boolean;
	vertical?: boolean;
	onDrag: (delta: number) => any;
};

export function Gutter(props: GutterProps) {
	const [selected, setSelected] = React.useState(false);
	React.useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (selected) {
				if (event.buttons === 0) {
					setSelected(false);
				} else {
					if (props.horizontal) {
						props.onDrag(event.movementY);
					} else {
						props.onDrag(event.movementX);
					}
				}
			}
		};
		window.addEventListener("mousemove", listener);
		return () => window.removeEventListener("mousemove", listener);
	}, [selected, props.onDrag]);
	const classes = ["gutter"];
	if (props.horizontal) {
		classes.push("horizontal");
	} else {
		classes.push("vertical");
	}
	return (
		<div
			onMouseDown={() => setSelected(true)}
			className={classes.join(" ")}
		></div>
	);
}

Gutter.size = 7;
