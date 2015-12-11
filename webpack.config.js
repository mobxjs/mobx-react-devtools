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
