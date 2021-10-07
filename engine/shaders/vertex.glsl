
attribute vec3 aVertexCoord;
attribute vec4 aTextureCoord;
// attribute vec4 aTintColor;

uniform mat3 uCamera;
uniform mat3 uViewport;

varying vec4 vTextureCoord;
// varying vec4 vTintColor;
varying vec4 vDebugColor;

// Effects
// Vignette(strength)
// Grain(strength)
// ChrmoticAberration(strength)
// Bloom(strength)
// per object? MotionBlur(strength)
// TODO color correction (allow for black and white, sepia, etc.)

const float WorldSpace = 0.0;
const float ScreenSpace = 1.0;

void debugCondition(bool condition) {
	if (condition) {
		vDebugColor = vec4(0.0, 1.0, 0.0, 1.0);
	} else {
		vDebugColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
}

void main() {
	vTextureCoord = aTextureCoord;
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