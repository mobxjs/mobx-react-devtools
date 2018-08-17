const { join } = require("path")
const webpack = require("webpack")

module.exports = {
    mode: process.env.NODE_ENV,
    entry: join(__dirname, "src", "index.js"),
    output: {
        libraryTarget: "umd",
        library: "mobxDevtools",
        path: __dirname,
        filename: "index.js",
        globalObject: "this"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.svg$/,
                use: "url-loader"
            }
        ]
    },
    externals: {
        "mobx-react": {
            root: "mobxReact",
            commonjs: "mobx-react",
            commonjs2: "mobx-react",
            amd: "mobx-react"
        },
        react: {
            root: "React",
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        },
        mobx: "mobx"
    }
}
