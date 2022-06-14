import { Resources } from "./resources.js";

export class SpriteResource {
	static load(url: string): Promise<SpriteResource> {
		return Resources.load(url, async () => {
			const htmlImage = new Image();
			htmlImage.src = url;
			await new Promise((resolve) => (htmlImage.onload = resolve));
			const bitmap = await createImageBitmap(htmlImage);
			return new SpriteResource(bitmap);
		});
	}
	async load(url: string): Promise<void> {}

	constructor(readonly bitmap: ImageBitmap) {}
}
