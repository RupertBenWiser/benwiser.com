import { mat4, glMatrix } from "gl-matrix";

import ShaderProgram from "./ShaderProgram";

class Model {
    private MODEL_MATRIX: mat4;
    private scaleFactor: [number, number, number];
    private rotationXFactor: number;
    private rotationYFactor: number;
    private translationFactor: [number, number, number];

    private gl: WebGLRenderingContext;
    private v: number[];
    private vertexBuffer: WebGLBuffer;
    private textureBuffer: WebGLBuffer;
    private textureId: WebGLTexture;
    private textureLoaded: boolean;

    constructor(gl: WebGLRenderingContext, v: number[], t: number[], texture: string) {
        this.textureLoaded = false;
        this.gl = gl;

        this.v = v;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        this.MODEL_MATRIX = new Float32Array(16) as mat4;
        mat4.identity(this.MODEL_MATRIX);

        this.textureId = gl.createTexture();
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(t), gl.STATIC_DRAW);

        const textureImage = new Image();
        textureImage.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.textureId);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
            gl.generateMipmap(gl.TEXTURE_2D);
            this.textureLoaded = true;
        };

        textureImage.src = texture;
    }

    public translate(translation: [number, number, number]) {
        this.translationFactor = translation;
    }

    public scale(scale: [number, number, number]) {
        this.scaleFactor = scale;
    }

    public rotateX(angle: number) {
        this.rotationXFactor = angle;
    }

    public rotateY(angle: number) {
        this.rotationYFactor = angle;
    }

    public render(shader: ShaderProgram): void {
        if (!this.textureLoaded) return;

        const POINTS: number = 3;

        mat4.identity(this.MODEL_MATRIX);
        mat4.translate(this.MODEL_MATRIX, this.MODEL_MATRIX, this.translationFactor);

        mat4.rotate(this.MODEL_MATRIX, this.MODEL_MATRIX, glMatrix.toRadian(this.rotationXFactor), [1, 0, 0]);
        mat4.rotate(this.MODEL_MATRIX, this.MODEL_MATRIX, glMatrix.toRadian(this.rotationYFactor), [0, 1, 0]);

        mat4.scale(this.MODEL_MATRIX, this.MODEL_MATRIX, this.scaleFactor);

        shader.setMatrix("MODEL_MATRIX", this.MODEL_MATRIX);

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureId);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const coordsPos = shader.getAttribLocation("coords");
        this.gl.vertexAttribPointer(coordsPos, POINTS, this.gl.FLOAT, false, POINTS * Float32Array.BYTES_PER_ELEMENT, 0);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        const texCoordsPos = shader.getAttribLocation("texCoords");
        this.gl.vertexAttribPointer(texCoordsPos, 2, this.gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
        

        this.gl.enableVertexAttribArray(0);
        this.gl.enableVertexAttribArray(1);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.v.length / POINTS);
        this.gl.disableVertexAttribArray(1);
        this.gl.disableVertexAttribArray(0);
    }
}

export default Model;
