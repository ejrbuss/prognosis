import { Icon } from "./icon.js";

export type EmptyProps = {
	icon: string;
	text: string;
};

export function Empty(props: EmptyProps) {
	return (
		<div className="empty">
			<Icon icon={props.icon} />
			{props.text}
		</div>
	);
}
