var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  hot: false,
  output: {
    libraryTarget: 'umd',
    library: 'mobxDevtools',
    path: __dirname,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.svg$/,
      loader: 'url-loader'
    }]
  },
  externals: {
    'mobx-react': 'mobx-react',
    react: 'react',
    // 'react-addons-css-transition-group': 'react-addons-css-transition-group',
    // ^^^ vvv --- since react-addons-css-transition-group is just an alias package, avoid an additonal peer dependency by just referring to the actual react implementation
    'react-addons-css-transition-group': 'react/lib/ReactCSSTransitionGroup',
    mobx: 'mobx'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  ]
};
