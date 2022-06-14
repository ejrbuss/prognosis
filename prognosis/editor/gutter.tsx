import { classNames, useEventListener } from "./reactUtil.js";

export type GutterProps = {
	horizontal?: boolean;
	vertical?: boolean;
	onDrag: (delta: number) => any;
};

export function Gutter({ horizontal, vertical, onDrag }: GutterProps) {
	const [selected, setSelected] = React.useState(false);
	React.useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (selected) {
				if (event.buttons === 0) {
					setSelected(false);
				} else {
					event.stopPropagation();
					if (horizontal) {
						onDrag(event.movementY);
					} else {
						onDrag(event.movementX);
					}
				}
			}
		};
		window.addEventListener("mousemove", listener);
		return () => window.removeEventListener("mousemove", listener);
	});
	return (
		<div
			tabIndex={0}
			className={classNames("gutter", {
				horizontal,
				vertical,
				selected,
			})}
		>
			<div onMouseDown={() => setSelected(true)} className="bar" />
		</div>
	);
}
