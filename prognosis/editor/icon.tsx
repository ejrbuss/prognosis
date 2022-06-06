import { classNames } from "./classnames.js";

export type IconProps = {
	icon: string;
	button?: boolean;
	selected?: boolean;
	disabled?: boolean;
	small?: boolean;
	medium?: boolean;
	large?: boolean;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	title?: string;
};

export function Icon({
	icon,
	button,
	selected,
	disabled,
	small,
	medium,
	large,
	className,
	onClick,
	title,
}: IconProps) {
	return (
		<div
			title={title}
			onClick={onClick}
			className={classNames("icon", icon, className, {
				button,
				selected,
				disabled,
				small,
				medium,
				large,
			})}
		>
			<ion-icon name={icon} />
		</div>
	);
}
