'use strict'

const nodemon = require( 'nodemon' )
const R = require( 'ramda' )
const { getOutputFileMeta } = require( './webpack-utils' )

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

        // Ensure we exit nodemon when webpack exists.
        process.once( 'exit', () => {
            monitor.emit( 'exit' )
        })
        // Ensure Ctrl-C triggers exit.
        process.once( 'SIGINT', () => {
            process.exit( 0 )
        })
    }
}
