const webpackVersion = process.env.WEBPACK_VERSION;
const mode = webpackVersion === '3' ? '' : "mode: 'development',";

export default `
const path = require( 'path' )
const nodeExternals = require( 'webpack-node-externals' )
const NodemonPlugin = require( '{{{ nodemonPluginPath }}}' )

const baseDir = __dirname
const outputDir = path.resolve( baseDir, 'dist' )

const config = {
    target: 'node',
    ${mode}
    node: {
        __dirname: false,
        __filename: false,
    },

    entry: path.resolve( baseDir, 'server.js' ),

    externals: [ nodeExternals() ],

    output: {
        path: outputDir,
        filename: '{{{ outputFileName }}}',
    },

    module: {
        rules: [{
            test: /.js$/,
            exclude: /node_modules/,
            use: {
                loader: '{{{loader}}}',
                options: {
                    presets: [ '@babel/preset-env' ],
                },
            },
        }],
    },
    plugins: [
        new NodemonPlugin({{{ nodemonConfig }}})
    ],
}

module.exports = config
`;
