'use strict'

const path = require( 'path' )
const nodemon = require( 'nodemon' )
const chalk = require( 'chalk' )
const R = require( 'ramda' )

const isMapFile = R.endsWith( '.map' )
const getOutputFileName = R.pipe(
    R.prop( 'assets' ),
    R.keys,
    R.reject( isMapFile ),
    R.head
)

const getOutputFileMeta = ( compilation ) => {
    const outputFilename = getOutputFileName( compilation )
    const asset = compilation.assets[ outputFilename ]
    const absoluteFileName = asset.existsAt
    const relativeFileName = path.relative( '', absoluteFileName )

    return { absoluteFileName, relativeFileName }
}

const nodemonLog = ( filename ) => ( msg, colour ) => () => console.log(
    chalk[ colour ]( `[ Nodemon ] ${ msg } ${ filename }` )
)

module.exports = class {

    constructor(config) {
        this.args = config.argv
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
            watch: filename,
            args: this.args
        }

        const log = nodemonLog( displayname )

        const monitor = nodemon( nodemonOptions )

        monitor
            .on( 'start', log( 'Started:', 'green' ) )
            .on( 'crash', log( 'Crashed:', 'red' ) )
            .on( 'restart', log( 'Restarting:', 'cyan' ) )
            .once( 'quit', () => {
                log( 'Stopped:', 'cyan' )()
            })

        this.isNodemonRunning = true

        // See https://github.com/JacksonGariety/gulp-nodemon/issues/77
        process.on( 'SIGINT', () => {
            monitor.once( 'exit', () => {
                process.exit()
            })
        })
    }
}
