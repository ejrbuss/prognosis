import { Resource, Resources } from "./resources.js";

export class AudioResource implements Resource {
	static load(url: string): Promise<AudioResource> {
		return Resources.load(url, async () => {
			const audioElement = new Audio();
			audioElement.src = url;
			await new Promise((resolve) => (audioElement.onload = resolve));
			return new AudioResource(url, audioElement);
		});
	}

	constructor(readonly url: string, readonly audioElement: HTMLAudioElement) {}
}
