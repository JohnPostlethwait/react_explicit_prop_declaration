var reactTools = require('react-tools');


module.exports = {
  process: function (source, path) {
    return reactTools.transform(source, {
      sourceMap:      true,
      sourceFilename: path
    });
  }
};
