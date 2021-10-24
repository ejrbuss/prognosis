#version 300 es

in vec3 aVertexCoord;
in vec3 aTextureCoord;
in vec4 aTintColor;

uniform mat3 uCamera;
uniform mat3 uViewport;

out vec3 vTextureCoord;
out vec4 vTintColor;

const float WorldSpace = 1.0;

void main() {
	vTextureCoord = aTextureCoord;
	vTintColor = aTintColor;
	vec2 position = aVertexCoord.xy;
	float space = aVertexCoord.z;
	// Apply camera transform if in world space
	if (space == WorldSpace) {
		position = (vec3(position, 1.0) * uCamera).xy;
	}
	// Apply viewport transform
	position = (vec3(position, 1.0) * uViewport).xy;
	// output position
	gl_Position = vec4(position, 0.0, 1.0);
}