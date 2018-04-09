/* eslint-disable no-console */
import path from 'path';
import { spawn } from 'child-process-promise';
import { defineSupportCode } from 'cucumber';
import { webpackConfigFileName } from './templates';

defineSupportCode(({ Before, After }) => {
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
      this.errors = [];
      this.childProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        this.output.push(data.toString());
      });
      this.childProcess.stderr.on('data', (data) => {
        console.log(data.toString());
        this.errors.push(data.toString());
      });
    };
  });

  Before(function () {
    this.simulateCtrlC = () => {
      this.childProcess.kill('SIGINT');
    };
  });

  After(function () {
    this.childProcess.kill('SIGINT');
    if (this.errors.length > 0) {
      throw new Error(`Errors: ${this.errors}`);
    }
  });
});
