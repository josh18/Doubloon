// Modules
import React, { Component, PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';

// Styles
import styles from '../styles.less';

class Demo extends Component {
    importDemoData = () => {
        let {
            importData,
            routerPush
        } = this.props;

        let request = new XMLHttpRequest();
        request.addEventListener('load', () => {
            importData(JSON.parse(request.responseText));

            routerPush('/');
        });
        request.open('GET', '/placeholder.json');
        request.send();
    }

    render() {
        return (
            <Button onClick={this.importDemoData} styleName="demo">
                Import demo data
            </Button>
        );
    }
}

Demo.propTypes = {
    importData: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired
};

export default CSSModules(Demo, styles);
