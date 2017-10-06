import * as R from 'ramda'
import { defineSupportCode } from 'cucumber'

const ONE_SECOND = 1000
const STEP_TIME_OUT = 10 * ONE_SECOND
const WAIT_TIMEOUT = STEP_TIME_OUT - ONE_SECOND

defineSupportCode( function({ Before, setDefaultTimeout }) {
    Before( function() {
        setDefaultTimeout( STEP_TIME_OUT )
    })

    Before( function() {
        this.waitForOutputToContain = ( text ) => {
            const output = this.output
            return new Promise( ( resolve, reject ) => {
                const intervalID = setInterval( checkOutput, ONE_SECOND )
                setTimeout( onTimeout, WAIT_TIMEOUT )

                function checkOutput() {
                    // Note that we shift the output array here.
                    const getNextOutputBlock = () => R.defaultTo( '', output.shift() )

                    let isFound = false

                    do {
                        isFound = R.contains( text, getNextOutputBlock() )
                    } while ( !isFound && !R.isEmpty( output ) )

                    if ( isFound ) {
                        clearInterval( intervalID )
                        resolve()
                    }
                }

                function onTimeout() {
                    clearInterval( intervalID )
                    reject( new Error( 'Timeout!' ) )
                }
            })
        }
    })
})
