import { defineSupportCode } from 'cucumber'

defineSupportCode( function({ Given, Then }) {
    Given( 'the server has started', function() {
        return this.waitForOutputToContain( 'Server started' )
    })

    Then( 'the output should include {string}', function( expectedOutput ) {
        return this.waitForOutputToContain( expectedOutput )
    })

    Then( 'the server should start with the arguments {string}', function( argv ) {
        return this.waitForOutputToContain( `Server started with argv: ${ argv }` )
    })

    Then( /^the server should (?:start|restart)$/, function() {
        return this.waitForOutputToContain( 'Server started' )
    })

    Then( `the server shouldn't restart`, function() {
        const reject = () => {
            throw new Error( `The server restarted when it shouldn't have` )
        }
        const fulfill = () => true
        return this.waitForOutputToContain( 'Server started' )
            .then( reject, fulfill ) // We invert the fulfill/reject logic here.
    })
})
