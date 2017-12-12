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

        // Ensure Ctrl-c stop nodemon.
        // Based on https://github.com/JacksonGariety/gulp-nodemon/commit/8ee28a46a9f335d9babf0131fde29b646cc621c3
        // Notes:
        // - https://github.com/JacksonGariety/gulp-nodemon/issues/77 work on Mac but not Windows.
        // - Not listening to SIGTERM, like https://github.com/webpack/webpack-dev-server/blob/93cb3dc600e6c547cec7580ace4bf4a56cf2fe98/bin/webpack-dev-server.js
        // - Also consider https://github.com/sindresorhus/exit-hook
        process.once( 'exit', () => {
            monitor.emit( 'exit' )
        })
        process.once( 'SIGINT', () => {
            process.exit( 0 )
        })
    }
}
