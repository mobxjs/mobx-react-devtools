var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    hot: false,
    output: {
        libraryTarget: 'umd',
        library: 'mobservableDevtools',
        path: __dirname,
        filename: 'index.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    externals: {
        "mobservable-react": "mobservable-react",
        "mobservable": "mobservable"
    }
}
