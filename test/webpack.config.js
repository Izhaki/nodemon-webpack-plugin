const path = require( 'path' )
const nodeExternals = require( 'webpack-node-externals' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const NodemonPlugin = require( '../src' )

const config = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },

    entry: './test/server.js',

    // devtool: 'cheap-source-map',

    externals: [ nodeExternals() ],

    output: {
        path: path.resolve( './test/dist' ),
        filename: 'server.js',
        // filename: '[name]-[hash].js',
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
        new NodemonPlugin({
            // verbose: true,
            // watch: path.resolve( './test/dist' ),
            // ignore: [ '*.json' ],
        }),
        new CopyWebpackPlugin( [{ from: './test/locales', to: 'locales' }] ),
    ],
}

module.exports = config
