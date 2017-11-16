const webpack = require('webpack');

module.exports = {
    context: __dirname + '/assets/js',
    entry: './main.js',
    output: {
        filename:          'main.js',
        path:              __dirname + '/web/dist/assets/js',
        publicPath:        '/dist/assets/js',
        sourceMapFilename: 'dnBOUAwY76qx3MmZxtHn.map'
    },
    module: {
        loaders: [
            {
                test:    /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader:  'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test:   /\.ejs$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.ProvidePlugin({
            $:      'jquery',
            jQuery: 'jquery',
            _:      'underscore'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unsafe:        true,
                drop_console:  false,
                drop_debugger: false,
                screw_ie8:     true,
                warnings:      false
            }
        })
    ]
};
