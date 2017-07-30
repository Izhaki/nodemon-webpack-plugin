'use strict'

const nodemon = require( 'nodemon' )
const path = require( 'path' )
const chalk = require( 'chalk' )

const getOutputFileMeta = ( compilation ) => {
    const outputFilename = compilation.outputOptions.filename
    const asset = compilation.assets[ outputFilename ]
    const absoluteFileName = asset.existsAt
    const relativeFileName = path.relative( '', absoluteFileName )

    return { absoluteFileName, relativeFileName }
}

const nodemonLog = ( filename ) => ( msg, colour ) => () => console.log(
    chalk[ colour ](`[ Nodemon ] ${ msg } ${ filename }`)
)

module.exports = class {

    constructor() {
        this.isWebpackWatching = false
        this.isNodemonRunning = false
    }

    apply( compiler ) {

        compiler.plugin( 'after-emit', ( compilation, callback ) => {
            if ( this.isWebpackWatching && !this.isNodemonRunning ) {
                const { absoluteFileName, relativeFileName } = getOutputFileMeta( compilation )
                this.startMonitoring( absoluteFileName, relativeFileName )
            }
            callback()
        })

        compiler.plugin( 'watch-run', ( compiler, callback ) => {
            this.isWebpackWatching = true
            callback()
        })

    }

    startMonitoring( filename, displayname ) {
        const nodemonOptions = {
            script: filename,
        }

        const log = nodemonLog( displayname )

        nodemon( nodemonOptions )
            .on( 'start', log( 'Started:', 'green' ) )
            .on( 'crash', log( 'Crashed:', 'red' ) )
            .on( 'restart', log( 'Restarting:', 'cyan' ) )
            .once( 'quit', () => {
                log( 'Stopped:', 'cyan' )()
                process.exit() // See https://github.com/JacksonGariety/gulp-nodemon/issues/77
            })

        this.isNodemonRunning = true
    }
}
