import { Schema } from "../data/schema.js";
import { Resources } from "./resources.js";
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

export type Frames = Partial<Record<string, Frame>>;

export class SpriteSheetResource {
	static load(url: string, spriteUrl: string): Promise<SpriteSheetResource> {
		return Resources.load(url, async () => {
			const spriteResourcePromise = SpriteResource.load(spriteUrl);
			const spriteSheetJson = await (await fetch(url)).json();
			const spriteResource = await spriteResourcePromise;
			const spriteSheet = SpriteSheetSchema.assert(spriteSheetJson);
			const frames: Frames = {};
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
					const frameSpriteResource = new SpriteResource(bitmap);
					frames[frameKey] = new Frame(frame.duration, frameSpriteResource);
				})
			);
			return new SpriteSheetResource(frames);
		});
	}

	constructor(readonly frames: Partial<Record<string, Frame>>) {}
}
