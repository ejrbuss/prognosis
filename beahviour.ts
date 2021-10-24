function IntegerRange() {}

export class MyProperties extends EditorProperties {
	@IntSlider(0, 100)
	@IntInput()
	@FloatInput()
	@FloatSlider()
	@StringInput()
	@MultilineStringInput()
	@ToggleInput()
	@Layout(row, col)
	@EnumInput()
	@TypeInput()
	speed: number;
}

export class MyComponent extends Component {}

type ClassOf<T> = new (...args: any[]) => T;

class Signal<Payload> {
	name: string;
	payload: Payload;
}

class Entity {
	getComponent<C>(componentClass: ClassOf<C>): C {
		return null;
	}
}

abstract class Behaviour<EditorProperties, Component> {
	abstract createComponent(signal: Signal<EditorProperties>): Component;
	onCreate?(signal: Signal<void>, entity: Entity): void | Promise<void>;
	onDestroy?(signal: Signal<void>, entity: Entity): void | Promise<void>;
	onUpdate?(signal: Signal<void>, entity: Entity): void | Promise<void>;
}

export class MyBehaviour<MyProperties, MyComponent> extends Behaviour<
	MyProperties,
	MyComponent
> {
	createComponent(signal: Signal<MyProperties>): MyComponent {
		return null as any;
	}

	onCreate() {}
}

export class MySystem<MyProperties, MyComponent> extends System {
	createComponent(signal: Signal<MyProperties>, entity: Entity): MyComponent {
		return null as any;
	}
}
