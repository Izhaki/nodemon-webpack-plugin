# Nodemon Webpack Plugin

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/880132/73990098-0a6ef580-4940-11ea-8df7-c93dda7edb4d.png" />
</p>

<p align="center">
  <a aria-label="Build" href="https://travis-ci.org/Izhaki/nodemon-webpack-plugin">
    <img alt="Travis (.org)" src="https://img.shields.io/travis/Izhaki/nodemon-webpack-plugin?style=flat-square">
  </a>
  <a aria-label="NPM version" href="https://npmjs.org/package/nodemon-webpack-plugin">
    <img alt="" src="https://img.shields.io/npm/v/nodemon-webpack-plugin?style=flat-square">
  </a>
  <a aria-label="Downloads" href="https://www.npmjs.com/package/nodemon-webpack-plugin">
    <img alt="" src="https://img.shields.io/npm/dt/nodemon-webpack-plugin?style=flat-square">
  </a>
</p>

Uses [Nodemon](https://nodemon.io/) to watch and restart your module's output file (presumably a server), but only when webpack is in watch mode (ie, `--watch`).

Saves the need for installing, configuring and running Nodemon as a separate process.

## Installation

```bash
npm install nodemon-webpack-plugin --save-dev
```

## Usage

```javascript
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding

module.exports = {
    entry: './src/server.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'server.js',
    },
    plugins: [
        new NodemonPlugin(), // Dong
    ],
};
```

Then:

```shell
$ webpack --watch
```

## Modes

### Zero-config mode

```javascript
new NodemonPlugin();
```

Only watches the output file.

### With config

Allows a [Nodemon config object](https://github.com/remy/nodemon#config-files) to override and extend the default config:

```javascript
{
    script: outputFile,
    watch:  outputFile,
}
```

For example:

```javascript
new NodemonPlugin({
    /// Arguments to pass to the script being watched.
    args: ['demo'],

    // What to watch.
    watch: path.resolve('./dist'),

    // Files to ignore.
    ignore: ['*.js.map'],

    // Detailed log.
    verbose: true,

    // Node arguments.
    nodeArgs: ['--debug=9222'],

    // If using more than one entry, you can specify
    // which output file will be restarted.
    script: './dist/server.js',

    // Extensions to watch
    ext: 'js,njk,json',
});
```

## Example output

```shell
Hash: 1c0ed85f7670873d6269
Version: webpack 5.0.0-beta.4
Time: 42ms
Built at: 2019-11-12 23:51:57
    Asset      Size
server.js  2.41 KiB  [emitted]  [name: main]
Entrypoint main = server.js
./tmp/server.js 285 bytes [built]
    + 2 hidden modules

[nodemon] restarting due to changes...
[nodemon] starting `node tmp/dist/server.js`
```
