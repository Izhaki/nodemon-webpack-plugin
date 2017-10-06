const path = require( 'path' )
const R = require( 'ramda' )

const isMapFile = R.endsWith( '.map' )
const getOutputFileName = R.pipe(
    R.prop( 'assets' ),
    R.keys,
    R.reject( isMapFile ),
    R.head
)

const getOutputFileMeta = ( compilation ) => {
    const outputFileName = getOutputFileName( compilation )
    const asset = compilation.assets[ outputFileName ]
    const absoluteFileName = asset.existsAt
    const relativeFileName = path.relative( '', absoluteFileName )

    return { absoluteFileName, relativeFileName }
}

module.exports = {
    getOutputFileMeta,
}
