import { Schema } from "../data/schema.js";
import { JsonData } from "../data/store.js";

export namespace EditorApi {
	export async function getFileUrl(file: File): Promise<string> {
		const jsonResponse = await (
			await fetch("/editor/api/getFileUrl", {
				method: "post",
				body: JSON.stringify({
					name: file.name,
					size: file.size,
				}),
			})
		).json();
		return Schema.string.assert(jsonResponse);
	}

	export async function openFileUrl(fileUrl: string): Promise<void> {
		await fetch("/editor/api/openFileUrl", {
			method: "post",
			body: JSON.stringify({ fileUrl }),
		});
	}

	export async function save(sceneUrl: string, sceneData: JsonData) {
		await fetch("/editor/api/save", {
			method: "post",
			body: JSON.stringify({
				sceneUrl,
				sceneData,
			}),
		});
	}
}
