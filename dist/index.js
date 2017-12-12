'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

            compiler.plugin('after-emit', function (compilation, callback) {
                if (_this.isWebpackWatching && !_this.isNodemonRunning) {
                    var _getOutputFileMeta = getOutputFileMeta(compilation),
                        relativeFileName = _getOutputFileMeta.relativeFileName;

                    _this.startMonitoring(relativeFileName);
                }
                callback();
            });

            compiler.plugin('watch-run', function (compiler, callback) {
                _this.isWebpackWatching = true;
                callback();
            });
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

            // Ensure Ctrl-c stop nodemon.
            // Based on https://github.com/JacksonGariety/gulp-nodemon/commit/8ee28a46a9f335d9babf0131fde29b646cc621c3
            // Notes:
            // - https://github.com/JacksonGariety/gulp-nodemon/issues/77 work on Mac but not Windows.
            // - Not listening to SIGTERM, like https://github.com/webpack/webpack-dev-server/blob/93cb3dc600e6c547cec7580ace4bf4a56cf2fe98/bin/webpack-dev-server.js
            // - Also consider https://github.com/sindresorhus/exit-hook
            process.once('exit', function () {
                monitor.emit('exit');
            });
            process.once('SIGINT', function () {
                process.exit(0);
            });
        }
    }]);

    return _class;
}();