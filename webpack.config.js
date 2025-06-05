
const path = require('path');

module.exports = {
    mode: 'production', // or 'development'
    entry: path.resolve(__dirname, 'extension/src/content.js'),
    output: {
        filename: 'content.bundle.js',
        path: path.resolve(__dirname, 'extension/dist'),
    },
    target: 'web'
};
