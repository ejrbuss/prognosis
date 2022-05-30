export type Mutable<Type> = {
	-readonly [Key in keyof Type]: Type[Key];
};

export function once<FunctionType extends Function>(
	callback: FunctionType
): FunctionType {
	let result: any;
	return function (...args: any[]): any {
		if (callback !== undefined) {
			result = callback();
			(callback as any) = undefined;
		}
		return result;
	} as any;
}
