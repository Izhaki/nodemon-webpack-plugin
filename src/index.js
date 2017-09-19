'use strict'

const path = require( 'path' )
const nodemon = require( 'nodemon' )
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

module.exports = class {

    constructor( nodemonOptions ) {
        this.nodemonOptions = nodemonOptions
        this.isWebpackWatching = false
        this.isNodemonRunning = false
    }

    apply( compiler ) {
        compiler.plugin( 'after-emit', ( compilation, callback ) => {
            if ( this.isWebpackWatching && !this.isNodemonRunning ) {
                const { relativeFileName } = getOutputFileMeta( compilation )
                this.startMonitoring( relativeFileName )
            }
            callback()
        })

        compiler.plugin( 'watch-run', ( compiler, callback ) => {
            this.isWebpackWatching = true
            callback()
        })
    }

    startMonitoring( relativeFileName ) {
        const nodemonOptionsDefaults = {
            script: relativeFileName,
            watch: relativeFileName,
        }

        const nodemonOptions = R.merge( nodemonOptionsDefaults, this.nodemonOptions )

        const monitor = nodemon( nodemonOptions )

        monitor.on( 'log', ({ colour: colouredMessage }) => console.log( colouredMessage ) )

        this.isNodemonRunning = true

        // See https://github.com/JacksonGariety/gulp-nodemon/issues/77
        process.on( 'SIGINT', () => {
            monitor.once( 'exit', () => {
                process.exit()
            })
        })
    }
}
