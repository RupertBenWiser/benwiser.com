import { mat4 } from "gl-matrix";

import ShaderProgram from "./ShaderProgram";
import Model from "./Model";

const WIDTH:number = 800;
const HEIGHT:number = 600;

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.querySelector("body").appendChild(canvas);

const gl = canvas.getContext("webgl");

gl.clearColor(1, 0, 0, 1);

gl.enable(gl.DEPTH_TEST);

const PROJECTION_MATRIX = new Float32Array(16) as mat4;
const VIEW_MATRIX = new Float32Array(16) as mat4;

mat4.identity(PROJECTION_MATRIX);
mat4.identity(VIEW_MATRIX);

mat4.perspective(PROJECTION_MATRIX, 45, WIDTH / HEIGHT, 0.1, 1000);

const defaultShaderProgram = new ShaderProgram(gl);

const v = [
    -1, 1, 0,
    -1, 0, 0,
     0, 0, 0,
    -1, 1, 0,
     0, 0, 0,
     0, 1, 0,
];

const t = [
    0, 0,
    0, 1,
    1, 1,
    0, 0,
    1, 1,
    1, 0,
];

const mainModel = new Model(gl, v, t, "textures/test.png");

mainModel.translate([0, 0, -10]);

const renderLoop = () => {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    
    defaultShaderProgram.useProgram();
    defaultShaderProgram.setMatrix("PROJECTION_MATRIX", PROJECTION_MATRIX);
    defaultShaderProgram.setMatrix("VIEW_MATRIX", VIEW_MATRIX);

    mainModel.render(defaultShaderProgram);

    requestAnimationFrame(renderLoop);
};

renderLoop();
