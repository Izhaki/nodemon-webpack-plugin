import path from 'path'
import { spawn } from 'child-process-promise'
import { defineSupportCode } from 'cucumber'
import { webpackConfigFileName } from './templates'

defineSupportCode( function({ Before, After }) {
    Before( function() {
        this.launchWebpack = () => {
            this.renderTemplates()

            const webpackBin = path.relative( process.cwd(), path.join( 'node_modules', '.bin', 'webpack' ) )
            const configFilePath = path.join( this.tmpDir, webpackConfigFileName )

            const promise = spawn( webpackBin, [ `--config`, configFilePath, `--watch` ], { capture: [ 'stderr' ] })

            promise.then( function() {
                console.log( '\nWebpack stopped' )
            })
            .catch( function( err ) {
                console.error( 'Error starting webpack: ', err.stderr )
            })

            this.childProcess = promise.childProcess
            this.output = []
            this.childProcess.stdout.on( 'data', ( data ) => {
                console.log( data.toString() )
                this.output.push( data.toString() )
            })
        }
    })

    Before( function() {
        this.simulateCtrlC = () => {
            this.childProcess.kill( 'SIGINT' )
        }
    })

    After( function() {
        this.childProcess.kill( 'SIGINT' )
    })
})
