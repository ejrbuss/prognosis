import { Schema } from "../data/schema.js";

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
}
