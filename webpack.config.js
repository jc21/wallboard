const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer        = require('webpack-visualizer-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getTime           = require('date-fns/get_time');
const PACKAGE           = require('./package.json');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry:   './js/main.js',
    output:  {
        path:              path.resolve(__dirname, 'dist'),
        publicPath:        '/',
        filename:          'js/[name].bundle.js',
        chunkFilename:     'js/[name].bundle.[id].js',
        sourceMapFilename: 'dnBOUAwY76qx3MmZxtHn.map'
    },
    module:  {
        rules: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                use:     {
                    loader: 'babel-loader'
                }
            },
            {
                test:   /\.ejs$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.s?css$/,
                use:  [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader:  'css-loader',
                        options: {
                            modules: false
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:      'jquery',
            jQuery: 'jquery',
            _:      'underscore'
        }),
        new Visualizer({
            filename: '../webpack_stats.html'
        }),
        new HtmlWebpackPlugin({
            template:           'html/index.ejs',
            filename:           'index.html',
            inject:             false,
            minify:             false,
            chunksSortMode:     'none',
            templateParameters: {
                version:    PACKAGE.version,
                build_time: getTime(new Date())
            }
        }),
        new HtmlWebpackPlugin({
            template:           'html/version.ejs',
            filename:           'version.json',
            inject:             false,
            minify:             false,
            chunksSortMode:     'none',
            templateParameters: {
                version:    PACKAGE.version,
                build_time: getTime(new Date())
            }
        }),
        new CopyWebpackPlugin([{
            from:   'images',
            to:     'images',
            toType: 'dir'
        }])
    ]
};
