import { AudioAsset, SpriteAsset, SpriteSheetAsset } from "../assets.js";
import { Camera } from "../camera.js";
import { Color } from "../color.js";
import { Easing } from "../easing.js";
import { Point } from "../point.js";

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

export type InspectOptions = {
	name?: string;
};

export type InspectNumberOptions = InspectOptions & {
	integer?: boolean;
	range?: number;
	min?: number;
	max?: number;
};

export type InspectStringOptions = InspectOptions & {
	enum?: string[];
	resizeable?: boolean;
	pattern?: RegExp;
};

export class Inspector {
	constructor() {}

	inspectBoolean(
		controller: PropertyController<boolean>,
		options?: InspectOptions
	) {}

	inspectNumber(
		controller: PropertyController<number>,
		options?: InspectNumberOptions
	) {}

	inspectString(
		controller: PropertyController<string>,
		options?: InspectStringOptions
	) {}

	inspectColor(
		controller: PropertyController<Color>,
		options?: InspectOptions
	) {}

	inspectPoint(
		controller: PropertyController<Point>,
		options?: InspectOptions
	) {}

	inspectEasing(
		controller: PropertyController<Easing>,
		options?: InspectOptions
	) {}

	inspectCamera(
		controller: PropertyController<Camera>,
		options?: InspectOptions
	) {}

	inspectSpriteAsset(
		controller: PropertyController<SpriteAsset>,
		options?: InspectOptions
	) {}

	inspectSpriteSheetAsset(
		controller: PropertyController<SpriteSheetAsset>,
		options?: InspectOptions
	) {}

	inspectAudioAsset(
		controller: PropertyController<AudioAsset>,
		options?: InspectOptions
	) {}
}
