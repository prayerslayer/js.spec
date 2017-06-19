const fs = require('fs')
const path = require('path')
const node_modules = fs.readdirSync('node_modules')

const uglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  // node library
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
      query: {
        presets: [
          ['es2015', {
            modules: false
          }]
        ]
      }
    }]
  },
  plugins: [
    new uglifyJSPlugin()
  ]
}, {
  // <script>
  entry: './index.js',
  target: 'web',
  bail: true,
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'js.spec',
    libraryTarget: 'umd',
    filename: 'js.spec.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [
          ['es2015', {
            modules: false
          }]
        ]
      }
    }]
  },
  plugins: [
    new uglifyJSPlugin()
  ]
}]
