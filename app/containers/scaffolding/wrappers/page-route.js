// Modules
import React, { Component, PropTypes } from 'react';
import { Route } from 'react-router-dom';

class PageRoute extends Component {
    render() {
        let {
            component: Component,
            setPageControls,
            setPageTitle,
            ...props
        } = this.props;

        let render = (componentProps) => {
            return <Component {...componentProps} setPageControls={setPageControls} setPageTitle={setPageTitle} />;
        };

        return <Route {...props} render={render} />;
    }
}

PageRoute.propTypes = {
    component: PropTypes.func.isRequired,
    setPageControls: PropTypes.func,
    setPageTitle: PropTypes.func
};

export default PageRoute;
