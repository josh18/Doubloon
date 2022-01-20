const path = require('path');
const webpack = require('webpack');

const lessPluginAutoPrefix = require('less-plugin-autoprefix');
const lessPluginCleanCss = require('less-plugin-clean-css');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        './app/app.js'
    ],
    output: {
        path: path.resolve(__dirname, '../../build/assets'),
        filename: 'app.js',
    },
    resolveLoader: {
        modules: ['node_modules', 'config/webpack/loaders']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['latest', 'react', 'stage-0']
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                strictMath: true,
                                plugins: [
                                    new lessPluginAutoPrefix({browsers: ['last 2 versions']}),
                                    new lessPluginCleanCss({advanced: true})
                                ]
                            }
                        },
                        {
                            loader: 'prepend-loader',
                            options: {
                                text: "@import '{root}/app/less/variables.less';@import '{root}/app/less/mixins.less';" // eslint-disable-line quotes
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'app.css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    resolve: {
        modules: ['app', 'node_modules'],
        extensions: [
            '.js',
            '.jsx',
            '.json',
            '.less'
        ],
    }
};
