// Modules
import React, { Component, PropTypes } from 'react';

class Button extends Component {
    preventFocus = (e) => {
        e.preventDefault();
    }

    render() {
        const {
            setRef: ref,
            ...props
        } = this.props;

        return (
            <button onMouseDown={this.preventFocus} {...props} ref={ref}>
                {this.props.children}
            </button>
        );
    }
}

Button.propTypes = {
    children: PropTypes.node,
    setRef: PropTypes.func
};

export default Button;
