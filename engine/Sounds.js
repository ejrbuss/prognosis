import { Types } from "./Types.js";

const All = new Set();

const SourceToElement = {};

const load = async (source) => {
	return new Promise((resolve) => {
		const audioElement = new Audio(source);
		audioElement.onload = () => {
			All.add(audioElement);
			SourceToElement[source] = audioElement;
			resolve(audioElement);
		};
	});
};

const findBySource = (source) => {
	const soundElement = SourceToElement[source];
	if (!soundElement) {
		throw new Error(`No sound with provided source: ${source}!`);
	}
	return soundElement;
};

export const Sounds = {
	All,
	load,
	findBySource,
};

Types.define(Types.Sound.name, Types.Sound, (v) => All.has(v));
