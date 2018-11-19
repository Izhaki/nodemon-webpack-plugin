/* eslint-disable no-console */

const nodemon = require('nodemon');
const R = require('ramda');
const { getOutputFileMeta } = require('./webpack-utils');

module.exports = class {
  constructor(nodemonOptions) {
    this.nodemonOptions = nodemonOptions;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  apply(compiler) {
    const OnAfterEmit = (compilation, callback) => {
      if (this.isWebpackWatching && !this.isNodemonRunning) {
        const { relativeFileName } = getOutputFileMeta(compilation);
        this.startMonitoring(relativeFileName);
      }
      callback();
    };

    const onWatchRun = (comp, callback) => {
      this.isWebpackWatching = true;
      callback();
    };

    compiler.plugin('after-emit', OnAfterEmit);
    compiler.plugin('watch-run', onWatchRun);
  }

  startMonitoring(relativeFileName) {
    const nodemonOptionsDefaults = {
      script: relativeFileName,
      watch: relativeFileName,
    };

    const nodemonOptions = typeof this.nodemonOptions === 'string' ? this.nodemonOptions : R.merge(nodemonOptionsDefaults, this.nodemonOptions);

    const monitor = nodemon(nodemonOptions);

    monitor.on('log', ({ colour: colouredMessage }) => console.log(colouredMessage));

    this.isNodemonRunning = true;

    // Ensure we exit nodemon when webpack exists.
    process.once('exit', () => {
      monitor.emit('exit');
    });
    // Ensure Ctrl-C triggers exit.
    process.once('SIGINT', () => {
      process.exit(0);
    });
  }
};
