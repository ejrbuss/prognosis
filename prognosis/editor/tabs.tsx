export type TabsProps = {
	children?: React.ReactNode;
};

export function Tabs(props: TabsProps) {
	return <div className="tabs">{props.children}</div>;
}
