import { mat4 } from "gl-matrix";

import ShaderProgram from "./ShaderProgram";

class Model {
    private gl: WebGLRenderingContext;
    private v: number[];
    private vertexBuffer: WebGLBuffer;
    private MODEL_MATRIX: mat4;

    constructor(gl: WebGLRenderingContext, v: number[]) {
        this.gl = gl;

        this.v = v;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        this.MODEL_MATRIX = new Float32Array(16) as mat4;
        mat4.identity(this.MODEL_MATRIX);
    }

    public translate(translation: [number, number, number]) {
        mat4.translate(this.MODEL_MATRIX, this.MODEL_MATRIX, translation);
    }

    public render(shader: ShaderProgram): void {
        const POINTS: number = 2;

        const shaderLocation = shader.setMatrix("MODEL_MATRIX", this.MODEL_MATRIX);

        this.gl.enableVertexAttribArray(0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(0, POINTS, this.gl.FLOAT, false, POINTS * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.v.length / POINTS);
        this.gl.disableVertexAttribArray(0);
    }
}

export default Model;
