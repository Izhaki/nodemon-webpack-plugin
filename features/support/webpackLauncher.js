/* eslint-disable no-console */
import path from 'path';
import { spawn } from 'child-process-promise';
import kill from 'tree-kill';
import { Before, After } from 'cucumber';
import { webpackConfigFileName } from './templates';

Before(function () {
  this.launchWebpack = () => {
    this.renderTemplates();

    const webpackBin = path.relative(process.cwd(), path.join('node_modules', '.bin', 'webpack'));
    const configFilePath = path.join(this.tmpDir, webpackConfigFileName);

    const promise = spawn(webpackBin, ['--config', configFilePath, '--watch'], { capture: ['stderr'] });

    promise.then(() => {
      console.log('\nWebpack stopped');
    }).catch((err) => {
      console.error('Error starting webpack: ', err.stderr);
    });

    this.childProcess = promise.childProcess;

    this.output = [];
    this.childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
      this.output.push(data.toString());
    });
    // Note: As of https://github.com/webpack/webpack-cli/commit/6ded275ac50f80f4ea6b29bfcc676238b59322e2
    // All webpack output is done using the error stream.
    this.childProcess.stderr.on('data', (data) => {
      console.log(data.toString());
      this.output.push(data.toString());
    });
  };
});

Before(function () {
  this.simulateCtrlC = () => {
    kill(this.childProcess.pid, 'SIGINT');
  };
});

After(function () {
  kill(this.childProcess.pid, 'SIGINT');
});
