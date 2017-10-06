import path from 'path'
import { defineSupportCode } from 'cucumber'
import fs from 'fs-extra'
import tmp from 'tmp'

const projectPath = path.join( __dirname, '..', '..' )

const symLinkNodeModules = ( fromBaseDir, toBaseDir ) => {
    const fromNodeModulesDir = path.join( fromBaseDir, 'node_modules' )
    const toNodeModulesDir = path.join( toBaseDir, 'node_modules' )

    const moduleNames = fs.readdirSync( fromNodeModulesDir )

    moduleNames.forEach( ( moduleName ) => {
        const fromNodeModuleDir = path.join( fromNodeModulesDir, moduleName )
        const toNodeModuleDir = path.join( toNodeModulesDir, moduleName )

        fs.createSymlinkSync( fromNodeModuleDir, toNodeModuleDir )
    })
}

defineSupportCode( function({ Before }) {
    Before( function() {
        const tmpObject = tmp.dirSync({ unsafeCleanup: true })
        this.tmpDir = fs.realpathSync( tmpObject.name )
        // this.tmpDir = path.resolve( 'tmp' )

        symLinkNodeModules( projectPath, this.tmpDir )
    })
})
