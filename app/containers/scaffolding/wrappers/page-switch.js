// Modules
import React, { cloneElement, Component, PropTypes } from 'react';
import { Switch } from 'react-router-dom';

class PageRoute extends Component {
    render() {
        let {
            children,
            setPageControls,
            setPageTitle
        } = this.props;

        const childrenWithPageProps = React.Children.map(children,
            (child) => cloneElement(child, {
                setPageControls: setPageControls,
                setPageTitle: setPageTitle
            })
        );

        return (
            <Switch>
                {childrenWithPageProps}
            </Switch>
        );
    }
}

PageRoute.propTypes = {
    children: PropTypes.node.isRequired,
    setPageControls: PropTypes.func,
    setPageTitle: PropTypes.func
};

export default PageRoute;
