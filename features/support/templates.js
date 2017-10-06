import path from 'path'
import { defineSupportCode } from 'cucumber'
import uuid from 'uuid/v1'
import fs from 'fs-extra'
import Mustache from 'mustache'

export const webpackConfigFileName = 'webpack.config.js'
const entryFileName = 'server.js'
const unrelatedFileName = 'dist/config.json'

const webpackConfigFileContents = `
const path = require( 'path' )
const nodeExternals = require( 'webpack-node-externals' )
const NodemonPlugin = require( '{{{ nodemonPluginPath }}}' )

const baseDir = __dirname
const outputDir = path.resolve( baseDir, 'dist' )

const config = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },

    entry: path.resolve( baseDir, '${ entryFileName }' ),

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
                loader: 'babel-loader',
                options: {
                    presets: [ 'env' ],
                },
            },
        }],
    },
    plugins: [
        new NodemonPlugin({{{ nodemonConfig }}})
    ],
}

module.exports = config
`

const entryFileContents = `
const path = require( 'path' )
const express = require( 'express' )

const app = express()

const argv = process.argv.slice( 2 )

console.log( 'Server started with argv:', argv )

app.get( '/', ( req, res ) => {
    res.send( 'hello' +  '{{ uuid }}' )
})

app.listen( 3421 )
`
const unrelatedFileContents = `
{
  "domain": "www.example.com",
  "mongodb": {
    "host": "localhost",
    "port": 27017
  },
  "sessionId": "{{ uuid }}"
}
`

defineSupportCode( function({ Before }) {
    Before( function() {
        // Default context
        this.context = {
            nodemonPluginPath: path.resolve( 'dist' ),
            outputFileName: 'server.js',
            nodemonConfig: '',
        }
    })

    Before( function() {
        const renderTemplate = ( fileName, template ) => {
            this.context.uuid = uuid() // uuid is used to invalidate each file checksum
            const outputFile = path.join( this.tmpDir, fileName )
            const render = Mustache.render( template, this.context )
            fs.outputFileSync( outputFile, render )
        }

        this.renderWebpackConfig = () => renderTemplate( webpackConfigFileName, webpackConfigFileContents )
        this.renderEntryFile = () => renderTemplate( entryFileName, entryFileContents )
        this.renderUnrelatedFile = () => renderTemplate( unrelatedFileName, unrelatedFileContents )

        this.renderTemplates = () => {
            this.renderWebpackConfig()
            this.renderEntryFile()
            this.renderUnrelatedFile()
        }
    })
})
