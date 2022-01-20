// Modules
import React, { cloneElement, Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

// Wrappers
import CSSModules from 'wrappers/css-modules';
import Link from 'wrappers/link';

// Styles
import styles from './styles.less';

// Components
import Logo from './components/logo';
import Nav from './components/nav';

class Scaffolding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controls: null,
            title: ''
        };
    }

    setPageControls = (controls) => {
        this.setState({
            controls
        });
    }

    setPageTitle = (title) => {
        this.setState({
            title
        });
    }

    render() {
        let children = this.props.children;

        let {
            controls,
            title
        } = this.state;

        const childrenWithPageProps = React.Children.map(children,
            (child) => cloneElement(child, {
                setPageControls: this.setPageControls,
                setPageTitle: this.setPageTitle
            })
        );

        if (controls) {
            controls = controls.map((control) => {
                return cloneElement(control, {
                    className: styles.control
                });
            });
        }

        return (
            <div styleName="app">
                <Helmet title={title} titleTemplate="%s - Doubloon" defaultTitle="Doubloon" />
                <header styleName="page-header">
                    <Link styleName="logo" to="/">
                        <Logo size={35} />
                        Doubloon
                    </Link>
                    <div styleName="controls">
                        {controls}
                    </div>
                </header>
                <div styleName="page">
                    <Nav />
                    <main styleName="page-content">
                        {childrenWithPageProps}
                    </main>
                </div>
            </div>
        );
    }
}

Scaffolding.propTypes = {
    children: PropTypes.node.isRequired
};

Scaffolding = CSSModules(Scaffolding, styles);

export default Scaffolding;
