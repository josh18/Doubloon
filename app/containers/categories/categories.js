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
import { selectCategoriesExpanded } from './selectors-expanded';

// Containers
import EditCategory from './containers/edit-category';

// Components
import Category from './components/category';

// Styles
import styles from './styles.less';

// TODO
// Add search
// If empty add option to add commonly used catogories

class Categories extends Component {
    componentDidMount() {
        this.props.setPageControls([
            <Link to={`${this.props.match.url}/create`} key="new-category-control">Create category</Link>
        ]);
        this.props.setPageTitle('Categories');
    }

    componentWillUnmount() {
        this.props.setPageControls();
        this.props.setPageTitle();
    }

    render() {
        let {
            categories,
            match
        } = this.props;

        // Sort alphabetically
        categories = categories.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        // Categories list
        categories = categories.map((category, key) => {
            return (
                <Category {...category} match={match} key={key} />
            );
        });

        return (
            <Switch>
                <Route path={`${match.url}/:path(\\d+|create)?`} exact render={() => {
                    let parentMatch = match;

                    let categoriesList = <div className={styles.empty}>No categories to show.</div>;
                    if (categories.length) {
                        categoriesList = (
                            <ol className={styles.categories}>
                                {categories}
                            </ol>
                        );
                    }

                    return (
                        <div>
                            {categoriesList}
                            <Route path={`${match.url}/:id(\\d+)`} render={({match, history}) => <EditCategory id={match.params.id} routeToParent={() => history.push(parentMatch.url)} />} exact />
                            <Route path={`${match.url}/create`} render={({history}) => <EditCategory routeToParent={() => history.push(parentMatch.url)} />} exact />
                        </div>
                    );
                }} />
                <Route component={Error404} />
            </Switch>
        );
    }
}

Categories.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            transactions: PropTypes.arrayOf(
                PropTypes.shape({
                    amount: PropTypes.number.isRequired,
                    date: PropTypes.number.isRequired,
                    vendor: PropTypes.shape({
                        name: PropTypes.string.isRequired
                    }).isRequired
                })
            ).isRequired
        })
    ).isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
    setPageControls: PropTypes.func,
    setPageTitle: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
    categories: selectCategoriesExpanded
});

Categories = connect(mapStateToProps)(Categories);

export default Categories;
