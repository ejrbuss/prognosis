import { classNames } from "./reactUtil.js";

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
	style?: React.CSSProperties;
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
	style,
}: IconProps) {
	return (
		<div
			title={title}
			onClick={onClick}
			style={style}
			className={classNames("icon", icon, className, {
				button,
				selected,
				disabled,
				small,
				medium,
				large,
			})}
		>
			{icon && <ion-icon name={icon} />}
		</div>
	);
}
