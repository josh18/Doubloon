const path = require('path');
const webpack = require('webpack');

const lessPluginAutoPrefix = require('less-plugin-autoprefix');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        // 'webpack/hot/only-dev-server',
        './config/webpack/hot-dev-server.js',
        './app/app.js'
    ],
    output: {
        path: path.resolve(__dirname, '../../build/assets'),
        filename: 'app.js',
        publicPath: 'http://localhost:8080/assets/'
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
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            plugins: [new lessPluginAutoPrefix({browsers: ['last 2 versions']})]
                        }
                    },
                    {
                        loader: 'prepend-loader',
                        options: {
                            text: "@import '{root}/app/less/variables.less';@import '{root}/app/less/mixins.less';" // eslint-disable-line quotes
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    resolve: {
        modules: ['app', 'node_modules'],
        extensions: [
            '.js',
            '.jsx',
            '.json',
            '.less'
        ],
    },
    performance: {
        hints: false
    }
};
