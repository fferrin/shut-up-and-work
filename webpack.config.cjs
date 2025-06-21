
const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'extension/src/content.js'),
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname, 'extension/dist'),
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};