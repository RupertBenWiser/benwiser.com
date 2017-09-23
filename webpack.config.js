const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    entry: `${__dirname}/src/index.ts`,
    output: {
        filename: 'bundle.js',
        path: `${__dirname}/dist`,
        publicPath: 'dist'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};