# Nodemon Webpack Plugin

In your webpack configuration, assume a module with a single entry/output representing a node server.

When added, the plugin will run [Nodemon](https://nodemon.io/) on that server.

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
