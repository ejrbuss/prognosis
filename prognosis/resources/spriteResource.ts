import { Resource } from "./resources.js";

export class SpriteResource implements Resource {
	bitmap!: ImageBitmap;

	async load(url: string): Promise<void> {
		const htmlImage = new Image();
		htmlImage.src = url;
		await new Promise((resolve) => (htmlImage.onload = resolve));
		this.bitmap = await createImageBitmap(htmlImage);
	}
}
