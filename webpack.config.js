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
            { from: path.resolve(__dirname, "src/background.js") },
            { from: path.resolve(__dirname, "src/content.js") },
            { from: path.resolve(__dirname, "src/devtools.html") },
            { from: path.resolve(__dirname, "src/devtools.js") },
            { from: path.resolve(__dirname, "src/manifest.json") },
            { from: path.resolve(__dirname, "src/panel.html") },
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