export class Command {
    vertexData;
    textureCoordData;
    textrureData;
    tintData;
    constructor(vertexData, textureCoordData, textrureData, tintData) {
        this.vertexData = vertexData;
        this.textureCoordData = textureCoordData;
        this.textrureData = textrureData;
        this.tintData = tintData;
    }
}
export class Renderer {
    constructor(gl) { }
    buffer(command) { }
    flush(transformData) { }
    postProcess(program) { }
    swap() { }
}
//# sourceMappingURL=renderer.js.map