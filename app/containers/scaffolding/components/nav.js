// Modules
import React, { Component } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';
import Link from 'wrappers/link';

// Elements
import Icon from 'elements/icon/icon';

// Styles
import styles from '../styles.less';

class Nav extends Component {
    render() {
        return (
            <nav styleName="nav">
                <div styleName="nav-main">
                    <Link to="/" exact activeClassName={styles['is-active']}>
                        Overview
                    </Link>
                    <Link to="/transactions" activeClassName={styles['is-active']}>
                        Transactions
                    </Link>
                    <Link to="/categories" activeClassName={styles['is-active']}>
                        Categories
                    </Link>
                    <Link to="/vendors" activeClassName={styles['is-active']}>
                        Vendors
                    </Link>
                </div>
                <Link to="/settings" exact className={styles.settings} activeClassName={styles['is-active']}>
                    <Icon type="settings" size={14} />Settings
                </Link>
            </nav>
        );
    }
}

Nav = CSSModules(Nav, styles);

export default Nav;
