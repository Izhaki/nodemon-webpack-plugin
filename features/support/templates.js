import path from 'path';
import { Before } from 'cucumber';
import uuid from 'uuid/v1';
import fs from 'fs-extra';
import Mustache from 'mustache';
import webpackConfigTpl from './templates/webpack.config';
import entryTpl from './templates/entry';
import unrelatedTpl from './templates/unrelated';

const unrelatedFileName = 'dist/config.json';
let port = 3421;

Before(function() {
    // Default context
    this.context = {
        nodemonPluginPath: path.resolve('dist'),
        outputFileName: 'server.js',
        nodemonConfig: '',
        loader: 'babel-loader',
        webpackConfigFileName: 'webpack.config.js',
        isTypescript: false,
    };
});

Before(function() {
    const renderTemplate = (fileName, template) => {
        this.context.uuid = uuid(); // uuid is used to invalidate each file checksum

        // Sometimes builds fail due EADDRINUSE so increase the port for each test.
        this.context.port = port++; // eslint-disable-line no-plusplus
        const outputFile = path.join(this.tmpDir, fileName);
        const render = Mustache.render(template, this.context);
        fs.outputFileSync(outputFile, render);
    };

    this.renderWebpackConfig = () =>
        renderTemplate(this.context.webpackConfigFileName, webpackConfigTpl);
    this.renderEntryFile = () => renderTemplate('server.js', entryTpl);
    this.renderUnrelatedFile = () =>
        renderTemplate(unrelatedFileName, unrelatedTpl);

    this.renderTemplates = () => {
        this.renderWebpackConfig();
        this.renderEntryFile();
        this.renderUnrelatedFile();
    };
});
