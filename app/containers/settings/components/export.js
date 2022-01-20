// Modules
import React, { PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import Button from 'elements/button/button';

// Styles
import styles from '../styles.less';

function Export({ data }) {
    function exportData() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', 'doubloon-data.json');

        element.click();
    }

    return (
        <Button onClick={exportData} styleName="export">
            Export data
        </Button>
    );
}

Export.propTypes = {
    data: PropTypes.string
};

export default CSSModules(Export, styles);
