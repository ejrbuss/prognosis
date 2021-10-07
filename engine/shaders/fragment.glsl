precision mediump float;

varying vec4 vTextureCoord;
// varying vec4 vTintColor;
varying vec4 vDebugColor;

uniform sampler2D uTextureUnit0;
uniform sampler2D uTextureUnit1;
uniform sampler2D uTextureUnit2;
uniform sampler2D uTextureUnit3;
uniform sampler2D uTextureUnit4;
uniform sampler2D uTextureUnit5;
uniform sampler2D uTextureUnit6;
uniform sampler2D uTextureUnit7;

void debugCondition(bool condition) {
	if (condition) {
		gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
	} else {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
}

void main() {
	// Determine the assigned texture unit
	if (vTextureCoord.z == 0.0) {
		gl_FragColor = texture2D(uTextureUnit0, vTextureCoord.xy);
	} else if (vTextureCoord.z == 1.0) {
		gl_FragColor = texture2D(uTextureUnit1, vTextureCoord.xy);
	} else if (vTextureCoord.z == 2.0) {
		gl_FragColor = texture2D(uTextureUnit2, vTextureCoord.xy);
	} else if (vTextureCoord.z == 3.0) {
		gl_FragColor = texture2D(uTextureUnit3, vTextureCoord.xy);
	} else if (vTextureCoord.z == 4.0) {
		gl_FragColor = texture2D(uTextureUnit4, vTextureCoord.xy);
	} else if (vTextureCoord.z == 5.0) {
		gl_FragColor = texture2D(uTextureUnit5, vTextureCoord.xy);
	} else if (vTextureCoord.z == 6.0) {
		gl_FragColor = texture2D(uTextureUnit6, vTextureCoord.xy);
	} else if (vTextureCoord.z == 7.0) {
		gl_FragColor = texture2D(uTextureUnit7, vTextureCoord.xy);
	}

	// Output color or texture
	bool isColor = vTextureCoord.w != 0.0;
	gl_FragColor = isColor
		? vTextureCoord
		: gl_FragColor;

	// Override with debug color if provided
	bool isDebug = vDebugColor.w != 0.0;
	gl_FragColor = isDebug
		? vDebugColor
		: gl_FragColor;
}