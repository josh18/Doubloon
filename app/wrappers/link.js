// Modules
import React, { Component, PropTypes } from 'react';
import { NavLink } from 'react-router-dom';

class LinkWrapper extends Component {
    preventFocus(e) {
        e.preventDefault();
    }

    render() {
        return (
            <NavLink onMouseDown={this.preventFocus} {...this.props}>
                {this.props.children}
            </NavLink>
        );
    }
}

LinkWrapper.propTypes = {
    children: PropTypes.node
};

export default LinkWrapper;
