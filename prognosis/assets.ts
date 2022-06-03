import { Node, NodeTypes } from "./node.js";
import { Schema, SchemaType } from "./schema.js";

const NodeSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	props: Schema.record(Schema.any),
	children: Schema.array(Schema.string),
});

const SceneSchema = Schema.object({
	root: Schema.string,
	nodes: Schema.array(NodeSchema),
});

export type SceneSpec = SchemaType<typeof SceneSchema>;

export class SceneAsset {
	constructor(readonly sceneSpec: SceneSpec) {}

	hydrate(name: string = this.sceneSpec.root): Node {
		const spec = this.sceneSpec.nodes.find((node) => node.name === name);
		if (spec === undefined) {
			throw new Error(`Scene refers to unknown Node: "${name}!"`);
		}
		const node = new NodeTypes[spec.type](spec.name);
		const children = spec.children.map((childName) => this.hydrate(childName));
		// TODO hydrate properties
		children.forEach((child) => node.add(child));
		return node;
	}
}

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
	#loading: number = 0;
	#pool: Record<string, Promise<any>> = {};

	get loading(): number {
		return this.#loading;
	}

	async loadScene(sceneUrl: string): Promise<SceneAsset> {
		if (sceneUrl in this.#pool) {
			return this.#pool[sceneUrl];
		}
		this.#loading += 1;
		const sceneJson = await (await fetch(sceneUrl)).json();
		const scene = SceneSchema.assert(sceneJson);
		this.#loading -= 1;
		return new SceneAsset(scene);
	}

	async loadSprite(imageUrl: string): Promise<SpriteAsset> {
		if (imageUrl in this.#pool) {
			return this.#pool[imageUrl];
		}
		this.#loading += 1;
		const htmlImage = new Image();
		htmlImage.src = imageUrl;
		await new Promise((resolve) => (htmlImage.onload = resolve));
		const sprite = await createImageBitmap(htmlImage);
		this.#loading -= 1;
		return new SpriteAsset(sprite, Infinity);
	}

	async loadSpriteSheet(
		sheetUrl: string,
		iamgeUrl: string
	): Promise<SpriteSheetAsset> {
		if (sheetUrl in this.#pool) {
			return this.#pool[sheetUrl];
		}
		this.#loading += 1;
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
		this.#loading -= 1;
		return new SpriteSheetAsset(frames);
	}

	async loadAudio(audioUrl: string): Promise<AudioAsset> {
		if (audioUrl in this.#pool) {
			return this.#pool[audioUrl];
		}
		this.#loading += 1;
		const htmlAudio = new Audio();
		htmlAudio.src = audioUrl;
		await new Promise((resolve) => (htmlAudio.onload = resolve));
		this.#loading -= 1;
		return new AudioAsset(htmlAudio);
	}
};

export const Assets = new AssetsClass();
