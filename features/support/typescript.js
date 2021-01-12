/* eslint-disable no-console */
import path from 'path';
import { Before } from 'cucumber';
import * as ts from 'typescript';

// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
function compile(fileNames, options) {
  const program = ts.createProgram(fileNames, options);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);
  return allDiagnostics.map((diagnostic) => diagnostic.messageText);
}

Before(function () {
  this.runTypescript = () => {
    this.renderWebpackConfig();

    const configFilePath = path.join(
      this.tmpDir,
      this.context.webpackConfigFileName
    );

    const baseUrl = path.join(__dirname, '../..');

    return compile([configFilePath], {
      noEmit: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      // We use aliases to point to the package root - that way the types
      // are picked
      baseUrl,
      paths: { 'nodemon-webpack-plugin': ['.'] },
    });
  };
});
