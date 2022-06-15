export interface Resource {
	url: string;
}

const ResourcesClass = class Resources {
	#loadingCount: number = 0;
	#pool: Record<string, Promise<any>> = {};

	get loadingCount(): number {
		return this.#loadingCount;
	}

	get loading(): boolean {
		return this.#loadingCount > 0;
	}

	async load<ResourceType extends Resource>(
		url: string,
		thunk: () => Promise<ResourceType>
	): Promise<ResourceType> {
		if (url in this.#pool) {
			return this.#pool[url];
		}
		this.#loadingCount += 1;
		const promise = thunk();
		this.#pool[url] = promise;
		const resource = await promise;
		this.#loadingCount -= 1;
		return resource;
	}
};

export const Resources = new ResourcesClass();
