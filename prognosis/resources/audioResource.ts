import { Resource } from "./resources.js";

export class AudioResource implements Resource {
	audioElement!: HTMLAudioElement;

	async load(url: string): Promise<void> {
		this.audioElement = new Audio();
		this.audioElement.src = url;
		await new Promise((resolve) => (this.audioElement.onload = resolve));
	}
}
