import { Given } from 'cucumber';

Given('the following nodemon config:', function(nodemonConfig) {
    this.context.nodemonConfig = nodemonConfig;
});

Given('the output filename is {string}', function(outputFileName) {
    this.context.outputFileName = outputFileName;
});

Given('a webpack configuration that yields an error', function() {
    this.context.loader = 'missing-loader';
});

Given('I run webpack in watch mode', function() {
    this.launchWebpack();
});

Given('Ctrl-c has been pressed', function() {
    this.simulateCtrlC();
});
