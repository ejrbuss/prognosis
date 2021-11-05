export namespace Editor {
	// vec2Input
	// vec3Input
	// numericInput(min, max, step)
	// sliderInput(min, max, step)
	// dropdownInput(...options)
	// textInput
	// colorInput
	// fontInput
	// eventInput
	// entityInput
	// componentInput
	// behaviourInput
	// textureInput
	// audioInput

	export function numericInput(
		min: number = 0,
		max: number = Infinity,
		step: number = 1
	): PropertyDecorator {
		return function (target: any, propertyKey: string | symbol) {};
	}

	export function sliderInput(
		min: number = 0,
		max: number = 100,
		step: number = 1
	): PropertyDecorator {
		return function (target: any, propertyKey: string | symbol) {};
	}

	export function booleanInput(): PropertyDecorator {
		return function (target: any, propertyKey: string | symbol) {};
	}

	export function signalInput(): PropertyDecorator {
		return function (target: any, propertyKey: string | symbol) {};
	}
}
