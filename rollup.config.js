import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: __dirname + '/compiled/index.js',
    dest: __dirname + '/dist/bundle.js',
    format: 'iife',
    plugins: [
        resolve(),
        commonjs(),
    ]
}