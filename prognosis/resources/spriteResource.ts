import { Schema } from "../data/schema.js";
import { JsonData } from "../data/store.js";
import { Resource, Resources } from "./resources.js";

export class SpriteResource implements Resource {
	static copy(spriteResource: SpriteResource): SpriteResource {
		return spriteResource;
	}

	static toStore(spriteResource: SpriteResource): JsonData {
		return spriteResource.url;
	}

	static fromStore(data: JsonData): Promise<SpriteResource> {
		return SpriteResource.load(Schema.string.assert(data));
	}

	static load(url: string): Promise<SpriteResource> {
		return Resources.load(url, async () => {
			const htmlImage = new Image();
			htmlImage.src = url;
			await new Promise((resolve) => (htmlImage.onload = resolve));
			const bitmap = await createImageBitmap(htmlImage);
			return new SpriteResource(url, bitmap);
		});
	}
	async load(url: string): Promise<void> {}

	constructor(readonly url: string, readonly bitmap: ImageBitmap) {}
}
