/* eslint-disable no-console */

const nodemon = require('nodemon');
const R = require('ramda');
const { getOutputFileMeta } = require('./webpack-utils');

module.exports = class {
    constructor(nodemonOptions) {
        this.nodemonOptions = nodemonOptions;
        this.isWebpackWatching = false;
        this.isNodemonRunning = false;
        this.monitor = null;
    }

    apply(compiler) {
        const OnAfterEmit = (compilation, callback) => {
            if (this.isWebpackWatching) {
                if (compilation.errors.length > 0) {
                    console.log(
                        '[nodemon-webpack-plugin]: Compilation error, nodemon yet to start.'
                    );

                    // ensure server stops when compilation is broken
                    if (this.monitor) {
                        this.monitor.emit('exit');
                    }
                } else if (!this.isNodemonRunning) {
                    const { relativeFileName } = getOutputFileMeta(compilation);
                    this.startMonitoring(relativeFileName);
                }
            }
            callback();
        };

        const onWatchRun = (comp, callback) => {
            this.isWebpackWatching = true;
            callback();
        };

        const plugin = { name: 'nodemon-webpack-plugin"' };

        if (compiler.hooks) {
            compiler.hooks.afterEmit.tapAsync(plugin, OnAfterEmit);
            compiler.hooks.watchRun.tapAsync(plugin, onWatchRun);
        } else {
            compiler.plugin('after-emit', OnAfterEmit);
            compiler.plugin('watch-run', onWatchRun);
        }
    }

    startMonitoring(relativeFileName) {
        const nodemonOptionsDefaults = {
            script: relativeFileName,
            watch: relativeFileName,
        };

        const nodemonOptions = R.merge(
            nodemonOptionsDefaults,
            this.nodemonOptions
        );

        this.monitor = nodemon(nodemonOptions);

        this.monitor.on('log', ({ colour: colouredMessage }) =>
            console.log(colouredMessage)
        );

        this.isNodemonRunning = true;

        // Ensure we exit nodemon when webpack exists.
        process.once('exit', () => {
            this.monitor.emit('exit');
        });
        // Ensure Ctrl-C triggers exit.
        process.once('SIGINT', () => {
            process.exit(0);
        });
    }
};
