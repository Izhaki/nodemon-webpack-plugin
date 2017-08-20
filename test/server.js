const express = require( 'express' )

const app = express()

console.log( 'Arguments passed:', process.argv )

app.get( '/', ( req, res ) => {
    res.send( 'Hello World' )
})

app.listen( 3421 )
