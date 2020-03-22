const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        app: './src/index.js',
        // background: './src/background.js',
        // devtools: './src/devtools.js',
        // content: './src/content.js',
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, "public/background.js") },
            { from: path.resolve(__dirname, "public/content.js") },
            { from: path.resolve(__dirname, "public/devtools.html") },
            { from: path.resolve(__dirname, "public/devtools.js") },
            { from: path.resolve(__dirname, "public/manifest.json") },
            { from: path.resolve(__dirname, "public/panel.html") },
        ])
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};