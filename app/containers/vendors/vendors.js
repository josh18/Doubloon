// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Switch } from 'react-router-dom';

// Wrappers
import Link from 'wrappers/link';

// Elements
import Error404 from 'elements/error-404/error-404';

// Selectors
import { selectVendorsExpanded } from './selectors-expanded';
import { selectCategories } from 'containers/categories/selectors';

// Containers
import EditVendor from './containers/edit-vendor';

// Components
import Vendor from './components/vendor';

// Styles
import styles from './styles.less';

// TODO
// Add search
// Empty notice

class Vendors extends Component {
    componentDidMount() {
        this.props.setPageControls([
            <Link to={`${this.props.match.url}/create`} key="new-vendor-control">Create vendor</Link>
        ]);
        this.props.setPageTitle('Vendors');
    }

    componentWillUnmount() {
        this.props.setPageControls();
        this.props.setPageTitle();
    }

    render() {
        let {
            match,
            vendors
        } = this.props;

        // Sort alphabetically
        vendors = vendors.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        // Vendors list
        vendors = vendors.map((vendor, key) => {
            return (
                <Vendor {...vendor} match={match} key={key} />
            );
        });

        return (
            <Switch>
                <Route path={`${match.url}/:path(\\d+|create)?`} exact render={() => {
                    let parentMatch = match;

                    let vendorsList = <div className={styles.empty}>No vendors to show.</div>;
                    if (vendors.length) {
                        vendorsList = (
                            <ol className={styles.vendors}>
                                {vendors}
                            </ol>
                        );
                    }

                    return (
                        <div>
                            {vendorsList}
                            <Route path={`${match.url}/:id(\\d+)`} render={({match, history}) => <EditVendor id={match.params.id} routeToParent={() => history.push(parentMatch.url)} />} exact />
                            <Route path={`${match.url}/create`} render={({history}) => <EditVendor routeToParent={() => history.push(parentMatch.url)} />} exact />
                        </div>
                    );
                }} />
                <Route component={Error404} />
            </Switch>
        );
    }
}

Vendors.propTypes = {
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
    setPageControls: PropTypes.func,
    setPageTitle: PropTypes.func,
    vendors: PropTypes.arrayOf(
        PropTypes.shape({
            autoCategorise: PropTypes.bool.isRequired,
            categories: PropTypes.arrayOf(
                PropTypes.shape({
                    colour: PropTypes.string.isRequired,
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired
                })
            ),
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            pattern: PropTypes.string.isRequired,
            transactions: PropTypes.arrayOf(
                PropTypes.shape({
                    amount: PropTypes.number.isRequired,
                    categories: PropTypes.arrayOf(
                        PropTypes.shape({
                            colour: PropTypes.string.isRequired,
                            name: PropTypes.string.isRequired
                        })
                    ).isRequired,
                    date: PropTypes.number.isRequired
                })
            ).isRequired
        })
    ).isRequired
};

const mapStateToProps = createStructuredSelector({
    categories: selectCategories,
    vendors: selectVendorsExpanded
});

Vendors = connect(mapStateToProps)(Vendors);

export default Vendors;
