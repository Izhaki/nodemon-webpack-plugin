import { defineSupportCode } from 'cucumber'

defineSupportCode( function({ When }) {
    When( 'the entry file is modified', function() {
        this.renderEntryFile()
    })

    When( 'a file unrelated to the entry file is modified', function() {
        this.renderUnrelatedFile()
    })
})
