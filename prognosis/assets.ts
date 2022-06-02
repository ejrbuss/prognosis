import { Schema } from "./schema.js";
import { Mutable } from "./util.js";

export class SpriteAsset {
	constructor(readonly bitmap: ImageBitmap, readonly duration: number) {}
}

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

export class SpriteSheetAsset {
	constructor(readonly frames: Partial<Record<string, SpriteAsset>>) {}
}

export class AudioAsset {
	constructor(readonly audio: HTMLAudioElement) {}
}

const AssetsClass = class Assets {
	private pool: Record<string, Promise<any>> = {};
	readonly loading: number = 0;

	async loadSprite(imageUrl: string): Promise<SpriteAsset> {
		if (imageUrl in this.pool) {
			return this.pool[imageUrl];
		}
		(this as Mutable<this>).loading += 1;
		const htmlImage = new Image();
		htmlImage.src = imageUrl;
		await new Promise((resolve) => (htmlImage.onload = resolve));
		const sprite = await createImageBitmap(htmlImage);
		(this as Mutable<this>).loading -= 1;
		return new SpriteAsset(sprite, Infinity);
	}

	async loadSpriteSheet(
		sheetUrl: string,
		iamgeUrl: string
	): Promise<SpriteSheetAsset> {
		if (sheetUrl in this.pool) {
			return this.pool[sheetUrl];
		}
		(this as Mutable<this>).loading += 1;
		const spriteAssetPromise = this.loadSprite(iamgeUrl);
		const spriteSheetJson = await (await fetch(sheetUrl)).json();
		const spriteSheet = SpriteSheetSchema.assert(spriteSheetJson);
		const spriteAsset = await spriteAssetPromise;
		const frames: Partial<Record<string, SpriteAsset>> = {};
		await Promise.all(
			Object.keys(spriteSheet.frames).map(async (frameKey) => {
				const frame = spriteSheet.frames[frameKey];
				const bitmap = await createImageBitmap(
					spriteAsset.bitmap,
					frame.frame.x,
					frame.frame.y,
					frame.frame.w,
					frame.frame.h
				);
				frames[frameKey] = new SpriteAsset(bitmap, frame.duration);
			})
		);
		(this as Mutable<this>).loading -= 1;
		return new SpriteSheetAsset(frames);
	}

	async loadAudio(url: string): Promise<AudioAsset> {
		if (url in this.pool) {
			return this.pool[url];
		}
		(this as Mutable<this>).loading += 1;
		const htmlAudio = new Audio();
		htmlAudio.src = url;
		await new Promise((resolve) => (htmlAudio.onload = resolve));
		(this as Mutable<this>).loading -= 1;
		return new AudioAsset(htmlAudio);
	}
};

export const Assets = new AssetsClass();
