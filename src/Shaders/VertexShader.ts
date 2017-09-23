export default `
    precision mediump float;

    uniform mat4 PROJECTION_MATRIX;
    uniform mat4 VIEW_MATRIX;
    uniform mat4 MODEL_MATRIX;

    attribute vec2 coords;

    void main() {
        gl_Position = PROJECTION_MATRIX * VIEW_MATRIX * MODEL_MATRIX * vec4(coords, 0, 1);
    }
`;