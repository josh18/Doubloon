const path = require('path');
const utils = require('loader-utils');

module.exports = function(content) {
    this.cacheable();

    let opt = utils.parseQuery(this.query);

    if (opt.text) {
        let relativePath = path.relative(this.context, this.options.context);

        let text = opt.text.replace(/{root}/g, relativePath);

        return text + content;
    }

    return content;
};
