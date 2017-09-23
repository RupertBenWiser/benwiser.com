import VertexShader from "./Shaders/VertexShader";
import FragmentShader from "./Shaders/FragmentShader";

import { mat4 } from "gl-matrix";

class ShaderProgram {
    private shaderProgramID: WebGLProgram;
    private vertexShaderID: WebGLShader;
    private fragmentShaderID: WebGLShader;

    private gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.shaderProgramID = gl.createProgram();
        this.vertexShaderID = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShaderID = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(this.vertexShaderID, VertexShader);
        gl.shaderSource(this.fragmentShaderID, FragmentShader);

        gl.compileShader(this.vertexShaderID);
        
        console.log(gl.getShaderInfoLog(this.vertexShaderID));

        gl.compileShader(this.fragmentShaderID);
        console.log(gl.getShaderInfoLog(this.fragmentShaderID));

        gl.attachShader(this.shaderProgramID, this.vertexShaderID);
        gl.attachShader(this.shaderProgramID, this.fragmentShaderID);

        gl.linkProgram(this.shaderProgramID);

        this.gl = gl;
    }

    public getLocation(name: string): WebGLUniformLocation {
        return this.gl.getUniformLocation(this.shaderProgramID, name);
    }

    public setMatrix(name: string, matrix: mat4) {
        const location = this.getLocation(name);
        this.gl.uniformMatrix4fv(location, false, matrix);
    }

    public useProgram(): void {
        this.gl.useProgram(this.shaderProgramID);
    }
}

export default ShaderProgram;
