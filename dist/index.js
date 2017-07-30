'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodemon = require('nodemon');
var path = require('path');
var chalk = require('chalk');

var getOutputFileMeta = function getOutputFileMeta(compilation) {
    var outputFilename = compilation.outputOptions.filename;
    var asset = compilation.assets[outputFilename];
    var absoluteFileName = asset.existsAt;
    var relativeFileName = path.relative('', absoluteFileName);

    return { absoluteFileName, relativeFileName };
};

var nodemonLog = function nodemonLog(filename) {
    return function (msg, colour) {
        return function () {
            return console.log(chalk[colour](`[ Nodemon ] ${msg} ${filename}`));
        };
    };
};

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
                        absoluteFileName = _getOutputFileMeta.absoluteFileName,
                        relativeFileName = _getOutputFileMeta.relativeFileName;

                    _this.startMonitoring(absoluteFileName, relativeFileName);
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
        value: function startMonitoring(filename, displayname) {
            if (!this.nodemonOptions) {
                this.nodemonOptions = {};
            }

            if (!this.nodemonOptions.script) {
                this.nodemonOptions.script = filename;
            }

            if (!this.nodemonOptions.watch) {
                this.nodemonOptions.watch = filename;
            }

            var log = nodemonLog(displayname);

            nodemon(this.nodemonOptions).on('start', log('Started:', 'green')).on('crash', log('Crashed:', 'red')).on('restart', log('Restarting:', 'cyan')).once('quit', function () {
                log('Stopped:', 'cyan')();
                process.exit(); // See https://github.com/JacksonGariety/gulp-nodemon/issues/77
            });

            this.isNodemonRunning = true;
        }
    }]);

    return _class;
}();