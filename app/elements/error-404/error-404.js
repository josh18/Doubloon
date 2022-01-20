// Modules
import React, { Component } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Styles
import styles from './styles.less';

class Error404 extends Component {
    render() {
        return <div styleName="message">404: Unfortunately this page doesn't seem to exist.</div>;
    }
}

Error404 = CSSModules(Error404, styles);

export default Error404;
