#version 300 es

in vec3 vTextureCoord;
in vec4 vTintColor;

uniform sampler2D uTextureUnits[8];

out vec4 fragColor;

void main() {
	// Apply the assigned texture unit
	int textureUnit = int(vTextureCoord.z);
	for (int i = 0; i < 8; i += 1) {
		if (i == textureUnit) {
			outColor = texture(uTextureUnits[i], vTextureCoord.xy);
		}
	}
	// Apply tint
	fragColor *= vTintColor;
}