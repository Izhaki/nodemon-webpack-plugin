'use strict';

var path = require('path');
var R = require('ramda');

var isMapFile = R.endsWith('.map');
var getOutputFileName = R.pipe(R.prop('assets'), R.keys, R.reject(isMapFile), R.head);

var getOutputFileMeta = function getOutputFileMeta(compilation) {
    var outputFileName = getOutputFileName(compilation);
    var asset = compilation.assets[outputFileName];
    var absoluteFileName = asset.existsAt;
    var relativeFileName = path.relative('', absoluteFileName);

    return { absoluteFileName, relativeFileName };
};

module.exports = {
    getOutputFileMeta
};