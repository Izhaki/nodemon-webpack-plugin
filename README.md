# Nodemon Webpack Plugin

[![NPM Version](https://badge.fury.io/js/nodemon-webpack-plugin.svg?style=flat)](https://npmjs.org/package/nodemon-webpack-plugin)
[![Node version](https://img.shields.io/node/v/nodemon-webpack-plugin.svg?style=flat)](http://nodejs.org/download/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Izhaki/nodemon-webpack-plugin/master/LICENSE)


In your webpack configuration, assumes a module with a single entry/output representing a node server.

The plugin will watch and restart that server upon changes using [Nodemon](https://nodemon.io/).

**Zero configuration:**
- Monitoring will only apply when webpack is in watch mode (ie, `--watch`).
- The plugin only watches the output file.

## Installation

### npm

```shell
$ npm install nodemon-webpack-plugin --save-dev
```

### yarn

```shell
$ yarn add nodemon-webpack-plugin --dev
```

## Usage

```javascript
const NodemonPlugin = require( 'nodemon-webpack-plugin' )

module.exports = {
    entry: './src/server.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'server.js',    },
    plugins: [
        new NodemonPlugin()
    ]
}
```

Then:

```shell
$ webpack --watch
```

## Example output

```shell
[at-loader] Checking started in a separate process...
Hash: 78d6d3559b43851d1e49
Version: webpack 3.3.0
Child
    Hash: 78d6d3559b43851d1e49
    Time: 2405ms
            Asset     Size  Chunks             Chunk Names
        server.js  47.9 kB       0  [emitted]  main
    server.js.map  35.5 kB       0  [emitted]  main
       [9] ./src/server/server.ts 789 bytes {0} [built]
      [31] ./src/client/Home.jsx 2.84 kB {0} [built]
        + 44 hidden modules
[ Nodemon ] Restarting: dist/server.js
[ Nodemon ] Started: dist/server.js

[at-loader] Ok, 0.657 sec.
```
