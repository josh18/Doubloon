const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack-dev.config.js');

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
    contentBase: './app/',
    publicPath: '/assets/',
    filename: 'app.js',
    historyApiFallback: true,
    hot: true,
    stats: {
        chunkModules: false,
        chunks: false,
        colors: true,
        hash: false,
        timings: false,
        version: false
    },
    clientLogLevel: 'warning'
});
server.listen(8080, '0.0.0.0', function() {});
