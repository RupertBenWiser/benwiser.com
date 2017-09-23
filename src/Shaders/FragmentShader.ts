export default `
    precision mediump float;

    varying vec2 out_texCoords;

    uniform sampler2D main_Tex;

    void main() {
        gl_FragColor = texture2D(main_Tex, out_texCoords);
    }
`;