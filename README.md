# Nodemon Webpack Plugin

[![NPM Version](https://badge.fury.io/js/nodemon-webpack-plugin.svg?style=flat)](https://npmjs.org/package/nodemon-webpack-plugin)
[![Node version](https://img.shields.io/node/v/nodemon-webpack-plugin.svg?style=flat)](http://nodejs.org/download/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Izhaki/nodemon-webpack-plugin/master/LICENSE)

Uses [Nodemon](https://nodemon.io/) to watch and restart your module's output file, but only when webpack is in watch mode (ie, `--watch`).

Saves the need for installing, configuring and running Nodemon as a seperate process.

## Installation

### npm

```shell
$ npm install nodemon-webpack-plugin --save-dev
```

### yarn

```shell
$ yarn add nodemon-webpack-plugin --dev
```

## Modes

### Zero-config mode

```javascript
new NodemonPlugin()
```

Only watches the output file.

### With config

Allows a [Nodemon config object](https://github.com/remy/nodemon#config-files) to override and extend the default config:

```
{
    script: <output file>,
    watch:  <output file>,
}
```

For example:

```javascript
new NodemonPlugin({
    /// Arguments to pass to the script being restarted
    args: ['demo'],

    // What to watch
    watch: path.resolve('./dist'),

    // Files to ignore
    ignore: ['*.js.map'],

    // Provide detailed log
    verbose: true,
})
```

## Usage

```javascript
const NodemonPlugin = require( 'nodemon-webpack-plugin' )

module.exports = {
    entry: './src/server.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'server.js',
    },
    plugins: [
        new NodemonPlugin(),
    ],
}
```

Then:

```shell
$ webpack --watch
```

## Example output

```shell
Hash: 366cbbbab13237b29593
Version: webpack 3.4.1
Time: 50ms
    Asset     Size  Chunks             Chunk Names
server.js  3.17 kB       0  [emitted]  main
   [0] ./test/server.js 388 bytes {0} [built]
    + 3 hidden modules
[nodemon] restarting due to changes...
[nodemon] starting `node test/dist/server.js`
```
