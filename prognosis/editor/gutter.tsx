import { jsx, Component } from "./imd.js";
import { classNames } from "./imd-utils.js";

type GutterProps = {
	horizontal?: boolean;
	vertical?: boolean;
	onDrag?: (delta: number) => any;
};

export class Gutter extends Component<GutterProps> {
	static idCount = 0;
	selected: boolean = false;
	dx: number = 0;
	dy: number = 0;
	id = Gutter.idCount++;

	mousemove = (event: MouseEvent) => {
		if (this.selected) {
			if (event.buttons === 0) {
				this.selected = false;
			} else {
				event.stopPropagation();
				this.dx += event.movementX;
				this.dy += event.movementY;
			}
		}
	};

	componentWillMount(): void {
		window.addEventListener("mousemove", this.mousemove);
	}

	componentWillUnmount(): void {
		window.removeEventListener("mousemove", this.mousemove);
	}

	render({ horizontal, vertical, onDrag }: GutterProps) {
		if (onDrag !== undefined && this.selected) {
			onDrag(horizontal ? this.dy : this.dx);
		}
		this.dx = 0;
		this.dy = 0;
		return (
			<div
				tabIndex={0}
				className={classNames("gutter", {
					selected: this.selected,
					horizontal,
					vertical,
				})}
				onmousedown={() => (this.selected = true)}
			>
				<div className="bar" />
			</div>
		);
	}
}
