#version 300 es

in vec2 aVertexCoord;

out vec2 vTextureCoord;

void main() {
	vTextureCoord = (aVertexCoord + 1.0) / 2.0;
	gl_Position = vec4(aVertexCoord, 0.0, 1.0);
}