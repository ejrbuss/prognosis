export function loadShader(
	gl: WebGL2RenderingContext,
	source: string,
	type: number
): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error("Failed to create shader!");
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		// Something went wrong during compilation; get the error
		const lastError = gl.getShaderInfoLog(shader);
		const excerpt;
		throw new Error(
			`Error compiling shader ${shader}: ${lastError}\n${excerpt}`
		);
		errFn(
			"*** Error compiling shader '" +
				shader +
				"':" +
				lastError +
				`\n` +
				shaderSource
					.split("\n")
					.map((l, i) => `${i + 1}: ${l}`)
					.join("\n")
		);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}
