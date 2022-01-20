// Modules
import React, { PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Styles
import styles from './styles.less';

function StatsBar({amount, className, colour, max, name}) {
    let barValueStyle = {
        backgroundColor: colour,
        width: Math.round(amount / max * 100) + '%'
    };

    return (
        <div className={className} styleName="container">
            <div styleName="name">{name}</div>
            <div styleName="bar">
                <div styleName="bar-value" style={barValueStyle}></div>
            </div>
        </div>
    );
}

StatsBar.propTypes = {
    amount: PropTypes.number.isRequired,
    className: PropTypes.string,
    colour: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
};

StatsBar = CSSModules(StatsBar, styles);

export default StatsBar;
