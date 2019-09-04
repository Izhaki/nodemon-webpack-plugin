export default `
const path = require( 'path' )
const express = require( 'express' )

const app = express()

const argv = process.argv.slice( 2 )

console.log( 'Server started with argv:', argv )

app.get( '/', ( req, res ) => {
    res.send( 'hello' +  '{{ uuid }}' )
})

app.listen( {{ port }} )
`;
