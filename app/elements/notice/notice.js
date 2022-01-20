// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Styles
import styles from './styles.less';

class Notice extends Component {
    render() {
        let {
            message,
            type
        } = this.props;

        let noticeClass = classNames({
            notice: true,
            [type]: true,
        });

        return (
            <div styleName={noticeClass}>
                {message}
            </div>
        );
    }
}

Notice.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

Notice = CSSModules(Notice, styles);

export default Notice;
