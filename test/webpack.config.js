const path = require( 'path' )
const nodeExternals = require( 'webpack-node-externals' )
const NodemonPlugin = require( '../src' )

const config = {
    target: 'node',

    entry: './test/server.js',

    externals: [ nodeExternals() ],

    output: {
        path: path.resolve( './test/dist' ),
        filename: 'server.js',
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [ 'env' ],
                },
            },
        }],
    },
    plugins: [
        new NodemonPlugin(),
    ],
}

module.exports = config
