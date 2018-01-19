declare var window: any;

import { mat4 } from "gl-matrix";


import ShaderProgram from "./ShaderProgram";
import Model from "./Model";

import face from './Data/face';
import "tracking";

import { ObjLoaderFromUrl } from './Loaders/OBJLoader';

let WIDTH:number = 0; 
let HEIGHT:number = 0;

if (window.innerWidth > window.innerHeight) {
    WIDTH = (window.innerWidth / 2);
    HEIGHT = ((window.innerWidth / 2) * 3) / 4;
} else {
    WIDTH = window.innerWidth;
    HEIGHT = (window.innerWidth * 3) / 4;
}

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.querySelector(".head-section").appendChild(canvas);

const gl = canvas.getContext("webgl");

gl.clearColor(1, 1, 1, 1);

gl.enable(gl.DEPTH_TEST);

const PROJECTION_MATRIX = new Float32Array(16) as mat4;
const VIEW_MATRIX = new Float32Array(16) as mat4;

mat4.identity(PROJECTION_MATRIX);
mat4.identity(VIEW_MATRIX);

mat4.perspective(PROJECTION_MATRIX, 45, WIDTH / HEIGHT, 0.1, 1000);

const defaultShaderProgram = new ShaderProgram(gl);

let mouseCoords: [number, number] = [0, 0];

document.onmousemove = (event) => {
    mouseCoords = [event.pageX, event.pageY];
};

const currentScreenDimensions = (): [number, number] => {
    return [window.innerWidth, window.innerHeight];
};

currentScreenDimensions();

interface coords {
    x: number;
    y: number;
}

let useMouse = true;
let useFace = false;
let deviceCoords: coords;
let initialDeviceCoords: coords = {
    x: 0,
    y: 0,
};

window.addEventListener("deviceorientation", (event) => {
    deviceCoords = {
        x: 270 + event.beta / 45,
        y: event.gamma / 45,
    };
    if (event.beta !== null) {
        if (useMouse) {
            initialDeviceCoords = deviceCoords;
        }
        useMouse = false;
    }
}, false);

const headPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

const headRotation = {
    x: 180,
    y: 0,
};

const MAX_SPEED: number = 0.5;

(async () => {
    const Tracking = window.tracking;
    Tracking.ViolaJones.classifiers.face = face;
    const tracker = new Tracking.ObjectTracker("face");
    
    tracker.setInitialScale(2);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.05);
    
    Tracking.track('#trackerVideo', tracker, { camera: true });
    
    tracker.on('track', function(event) {
        if (event.data.length) {
            useFace = true;
            headPosition.x = event.data[0].x;
            headPosition.y = event.data[0].y;
            headPosition.width = event.data[0].width;
            headPosition.height = event.data[0].height;
        }
    });

    const headModel = await ObjLoaderFromUrl(gl, "models/head.obj", "textures/head.png");


    headModel.translate([0, 0, -65]);
    headModel.scale([30, 30, 30]);

    const renderLoop = () => {
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        

        if (useFace) {
            const rotateField = (field) => {
                if (Math.abs(headPosition[field] - headRotation[field]) > MAX_SPEED * 2) {
                    if (headRotation[field] < headPosition[field]) {
                        headRotation[field] += Math.max((headPosition[field] - headRotation[field]) / 2, MAX_SPEED);
                    } else if (headRotation[field] > headPosition[field]) {
                        headRotation[field] -= Math.max((headRotation[field] - headPosition[field]) / 2, MAX_SPEED);
                    }
                }
            };

            rotateField('x');
            rotateField('y');

            headModel.rotateX(-(120 - headRotation.y) / 5);
            headModel.rotateY(180 + ((120 - headRotation.x) / 10));
        } else if (useMouse) {
            const offsetFromCenterX = (mouseCoords[0] - (currentScreenDimensions()[0] / 2)) / (currentScreenDimensions()[0] / 2);
            const offsetFromCenterY = (mouseCoords[1] - (HEIGHT / 2)) / (HEIGHT / 2);

            headModel.rotateX(0 + offsetFromCenterY * 45);
            headModel.rotateY(180 + offsetFromCenterX * 45);
        } else {
            headModel.rotateX(0 + (deviceCoords.x - initialDeviceCoords.x) * - 25);
            headModel.rotateY(180 + (deviceCoords.y - initialDeviceCoords.y) * 25);
        }

        defaultShaderProgram.useProgram();
        defaultShaderProgram.setMatrix("PROJECTION_MATRIX", PROJECTION_MATRIX);
        defaultShaderProgram.setMatrix("VIEW_MATRIX", VIEW_MATRIX);

        headModel.render(defaultShaderProgram);

        requestAnimationFrame(renderLoop);
    };
    renderLoop();
})();
