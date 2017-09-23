export default `
    precision mediump float;

    uniform mat4 PROJECTION_MATRIX;
    uniform mat4 VIEW_MATRIX;
    uniform mat4 MODEL_MATRIX;

    attribute vec2 coords;
    attribute vec2 texCoords;

    varying vec2 out_texCoords;

    void main() {
        gl_Position = PROJECTION_MATRIX * VIEW_MATRIX * MODEL_MATRIX * vec4(coords, 0, 1);

        out_texCoords = texCoords;
    }
`;