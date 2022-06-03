import { AudioAsset, SpriteAsset, SpriteSheetAsset } from "./assets.js";
import { Camera } from "./camera.js";
import { Color } from "./color.js";
import { Easing } from "./easing.js";
import { Point } from "./point.js";

export type Controller<Target> = {
	[Property in keyof Target]: PropertyController<Target[Property]>;
};

export function control<Target>(target: Target): Controller<Target> {
	const controller: Controller<Target> = {} as any;
	for (const property in target) {
		controller[property] = new PropertyController(
			property,
			() => target[property],
			(value) => (target[property] = value)
		);
	}
	return controller;
}

export class PropertyController<Type> {
	constructor(
		readonly property: string,
		readonly get: () => Type,
		readonly set: (value: Type) => any
	) {}
}

export type InspectProps = {
	name?: string;
};

export type InspectNumberProps = InspectProps & {
	integer?: boolean;
	range?: number;
	min?: number;
	max?: number;
};

export type InspectStringProps = InspectProps & {
	enum?: string[];
	resizeable?: boolean;
	pattern?: RegExp;
};

export class NodeInspector {
	inspectBoolean(
		controller: PropertyController<boolean>,
		props?: InspectProps
	) {}

	inspectNumber(
		controller: PropertyController<number>,
		props?: InspectNumberProps
	) {}

	inspectString(
		controller: PropertyController<string>,
		props?: InspectStringProps
	) {}

	inspectColor(controller: PropertyController<Color>, props?: InspectProps) {}

	inspectPoint(controller: PropertyController<Point>, props?: InspectProps) {}

	inspectEasing(controller: PropertyController<Easing>, props?: InspectProps) {}

	inspectCamera(controller: PropertyController<Camera>, props?: InspectProps) {}

	inspectSpriteAsset(
		controller: PropertyController<SpriteAsset>,
		props?: InspectProps
	) {}

	inspectSpriteSheetAsset(
		controller: PropertyController<SpriteSheetAsset>,
		props?: InspectProps
	) {}

	inspectAudioAsset(
		controller: PropertyController<AudioAsset>,
		props?: InspectProps
	) {}
}
