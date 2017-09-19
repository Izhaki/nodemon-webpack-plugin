const path = require( 'path' )
const express = require( 'express' )
const i18n = require( 'i18n' )

i18n.configure({
    locales: [ 'en' ],
    directory: path.join( __dirname, '/locales' ),
})

const app = express()

const argv = process.argv.slice( 2 )

console.log( i18n.__( 'hello' ), ' argv:', argv )

app.get( '/', ( req, res ) => {
    res.send( 'Hello World' )
})

app.listen( 3421 )
