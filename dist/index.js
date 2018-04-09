'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-console */

var nodemon = require('nodemon');
var R = require('ramda');

var _require = require('./webpack-utils'),
    getOutputFileMeta = _require.getOutputFileMeta;

module.exports = function () {
  function _class(nodemonOptions) {
    _classCallCheck(this, _class);

    this.nodemonOptions = nodemonOptions;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  _createClass(_class, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var OnAfterEmit = function OnAfterEmit(compilation, callback) {
        if (_this.isWebpackWatching && !_this.isNodemonRunning) {
          var _getOutputFileMeta = getOutputFileMeta(compilation),
              relativeFileName = _getOutputFileMeta.relativeFileName;

          _this.startMonitoring(relativeFileName);
        }
        callback();
      };

      var onWatchRun = function onWatchRun(comp, callback) {
        _this.isWebpackWatching = true;
        callback();
      };

      var plugin = { name: 'nodemon-webpack-plugin"' };

      compiler.hooks.afterEmit.tapAsync(plugin, OnAfterEmit);
      compiler.hooks.watchRun.tapAsync(plugin, onWatchRun);
    }
  }, {
    key: 'startMonitoring',
    value: function startMonitoring(relativeFileName) {
      var nodemonOptionsDefaults = {
        script: relativeFileName,
        watch: relativeFileName
      };

      var nodemonOptions = R.merge(nodemonOptionsDefaults, this.nodemonOptions);

      var monitor = nodemon(nodemonOptions);

      monitor.on('log', function (_ref) {
        var colouredMessage = _ref.colour;
        return console.log(colouredMessage);
      });

      this.isNodemonRunning = true;

      // Ensure we exit nodemon when webpack exists.
      process.once('exit', function () {
        monitor.emit('exit');
      });
      // Ensure Ctrl-C triggers exit.
      process.once('SIGINT', function () {
        process.exit(0);
      });
    }
  }]);

  return _class;
}();