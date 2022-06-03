export interface Resource<Params extends any[] = []> {
	load(url: string, ...params: Params): Promise<void>;
}

const ResourcesClass = class Resources {
	#loadingResourcesCount: number = 0;
	#pool: Record<string, Promise<any>> = {};

	get loadingResourcesCount(): number {
		return this.#loadingResourcesCount;
	}

	get loading(): boolean {
		return this.#loadingResourcesCount > 0;
	}

	async load<Params extends any[], ResourceType extends Resource<Params>>(
		resourceConstructor: { new (): ResourceType },
		url: string,
		...params: Params
	): Promise<ResourceType> {
		if (url in this.#pool) {
			return this.#pool[url];
		}
		this.#loadingResourcesCount += 1;
		const resource = new resourceConstructor();
		const promise = resource.load(url, ...params).then(() => resource);
		this.#pool[url] = promise;
		await promise;
		this.#loadingResourcesCount -= 1;
		return resource;
	}
};

export const Resources = new ResourcesClass();
