// Modules
import React, { Component, PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';

// Styles
import styles from '../styles.less';

class Reset extends Component {
    reset = () => {
        let {
            importData,
            routerPush
        } = this.props;

        importData();
        routerPush('/');
    }

    render() {
        return (
            <Button onClick={this.reset} styleName="reset">
                Reset data
            </Button>
        );
    }
}

Reset.propTypes = {
    importData: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired
};

export default CSSModules(Reset, styles);
