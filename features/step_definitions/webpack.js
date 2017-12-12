import { defineSupportCode } from 'cucumber'

defineSupportCode( function({ Given }) {
    Given( 'the following nodemon config:', function( nodemonConfig ) {
        this.context.nodemonConfig = nodemonConfig
    })

    Given( 'the output filename is {string}', function( outputFileName ) {
        this.context.outputFileName = outputFileName
    })

    Given( 'I run webpack in watch mode', function() {
        this.launchWebpack()
    })

    Given( 'Ctrl-c has been pressed', function() {
        this.simulateCtrlC()
    })
})
