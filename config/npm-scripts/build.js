const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack-prod.config.js');

const compiler = webpack(webpackConfig);

// Copy top level non-js and non-html files
glob('./app/!(*.js)', {nodir: true}, (error, files) => {
    files.forEach((file) => {
        let output = './build/' + path.basename(file);
        if (file.endsWith('.html')) {
            fs.readFile(file, 'utf8', (error, data) => {
                if (error) {
                    console.error(error);
                }

                data = data.replace('<!-- ', '').replace(' -->', '');

                console.log(data);

                fs.outputFile(output, data, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            });
        } else {
            fs.copy(file, output, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }
    });
});

// Compile js / css
compiler.run((error, stats) => {
    if (error) {
        console.error(error);
    }

    // console.log(stats);
});
