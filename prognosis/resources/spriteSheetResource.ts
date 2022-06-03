import { Schema } from "../data/schema.js";
import { Resources, Resource } from "./resources.js";
import { SpriteResource } from "./spriteResource.js";

const FrameSchema = Schema.object({
	frame: Schema.object({
		x: Schema.number,
		y: Schema.number,
		w: Schema.number,
		h: Schema.number,
	}),
	duration: Schema.number,
});

const SpriteSheetSchema = Schema.object({
	frames: Schema.record(FrameSchema),
});

export class Frame {
	constructor(
		readonly duration: number,
		readonly spriteResource: SpriteResource
	) {}
}

export class SpriteSheetResource implements Resource<[string]> {
	frames!: Partial<Record<string, Frame>>;

	async load(url: string, spriteUrl: string): Promise<void> {
		const spriteResourcePromise = Resources.load(SpriteResource, spriteUrl);
		const spriteSheetJson = await (await fetch(url)).json();
		const spriteResource = await spriteResourcePromise;
		const spriteSheet = SpriteSheetSchema.assert(spriteSheetJson);
		this.frames = {};
		await Promise.all(
			Object.keys(spriteSheet.frames).map(async (frameKey) => {
				const frame = spriteSheet.frames[frameKey];
				const bitmap = await createImageBitmap(
					spriteResource.bitmap,
					frame.frame.x,
					frame.frame.y,
					frame.frame.w,
					frame.frame.h
				);
				const frameSpriteResource = new SpriteResource();
				frameSpriteResource.bitmap = bitmap;
				this.frames[frameKey] = new Frame(frame.duration, frameSpriteResource);
			})
		);
	}
}
