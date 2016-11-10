var fs = require('fs')
var path = require('path')
var node_modules = fs.readdirSync('node_modules')


module.exports = {
  entry: './index.js',
  target: 'node',
  bail: true,
  externals: node_modules,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js.spec.js',
    library: 'js.spec',
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }]
  },
  plugins: []
}
