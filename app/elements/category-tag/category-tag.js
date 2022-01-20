// Modules
import React, { PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Styles
import styles from './styles.less';

function CategoryTag({className, colour, name}) {
    let colourStyle = {
        backgroundColor: colour
    };

    return (
        <div className={className} styleName="category">
            <div styleName="category-colour" style={colourStyle}></div>
            <div styleName="category-name">
                {name}
            </div>
        </div>
    );
}

CategoryTag.propTypes = {
    className: PropTypes.string,
    colour: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

CategoryTag = CSSModules(CategoryTag, styles);

export default CategoryTag;
