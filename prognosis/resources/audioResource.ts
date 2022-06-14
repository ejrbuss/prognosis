import { Resources } from "./resources.js";

export class AudioResource {
	static load(url: string): Promise<AudioResource> {
		return Resources.load(url, async () => {
			const audioElement = new Audio();
			audioElement.src = url;
			await new Promise((resolve) => (audioElement.onload = resolve));
			return new AudioResource(audioElement);
		});
	}

	constructor(readonly audioElement: HTMLAudioElement) {}
}
