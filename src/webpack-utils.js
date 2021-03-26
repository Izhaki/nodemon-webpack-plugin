const path = require('path');

const notMapFile = (file) => !file.endsWith('.map');

// Returns the first assets that is not a map file
const getOutputFileName = (compilation) =>
  Object.keys(compilation.assets).filter(notMapFile)[0];

const getOutputFileMeta = (compilation, outputPath) => {
  const outputFileName = getOutputFileName(compilation);
  const absoluteFileName = path.join(outputPath, outputFileName);
  return path.relative('', absoluteFileName);
};

module.exports = {
  getOutputFileMeta,
};
