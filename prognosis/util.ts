export type Mutable<Type> = {
	-readonly [Key in keyof Type]: Type[Key];
};

export type ConstructorType<Type> = { new (...args: any[]): Type };
