// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Switch } from 'react-router-dom';

// Elements
import Error404 from 'elements/error-404/error-404';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';

// Actions
import { setTransactionFilter } from './actions';

// Selectors
import {
    earliestTransaction,
    latestTransaction,
    selectTransactionFilter
} from './selectors';
import {
    selectFilteredTransactionsExpanded,
    selectUncategorisedTransactionsExpanded
} from './selectors-expanded';

// Children Containers
import Categorise from './containers/categorise';
import ImportTransactions from './containers/import-transactions';

// Components
import TransactionsList from './components/transactions-list';

class Transactions extends Component {
    componentDidMount() {
        this.props.setPageControls([
            <ImportTransactions key="import-transactions" />
        ]);
        this.props.setPageTitle('Transactions');
    }

    componentWillUnmount() {
        this.props.setPageControls();
        this.props.setPageTitle();
    }

    render() {
        let {
            earliestTransaction,
            filter,
            latestTransaction,
            match,
            transactions,
            setTransactionFilter,
            uncategorisedTransactions
        } = this.props;

        let minYear;
        if (earliestTransaction) {
            minYear = new Date(earliestTransaction).getFullYear();
        } else {
            minYear = new Date().getFullYear();
        }

        let maxYear;
        if (latestTransaction) {
            maxYear = new Date(latestTransaction).getFullYear();
        } else {
            maxYear = new Date().getFullYear();
        }

        return (
            <Switch>
                <Route path={`${match.url}/categorise`} exact component={Categorise} />
                <Route path={`${match.url}/:year(\\d{4})?/:month(\\d{2})?`} render={({history, location, match}) => {
                    let {
                        month,
                        year
                    } = match.params;

                    let push = history.push;

                    if (
                        // Match /transactions
                        (location.pathname === match.url && !match.params.month && !match.params.year) ||
                        // Match /transactions/:year/:month as long as they are in a valid range
                        (
                            match.params.month && match.params.year &&
                            match.params.month >= 1 && match.params.month <= 12 &&
                            match.params.year >= minYear && match.params.year <= maxYear
                        )
                    ) {
                        return <TransactionsList month={parseInt(month)} year={parseInt(year)} latestTransaction={latestTransaction} setFilter={setTransactionFilter} transactions={transactions} filter={filter} routerPush={push} uncategorisedTransactions={uncategorisedTransactions} />;
                    }

                    return <Error404 />;
                }} />
            </Switch>
        );
    }
}

Transactions.propTypes = {
    earliestTransaction: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
    filter: PropTypes.shape({
        maxYear: PropTypes.number.isRequired,
        minYear: PropTypes.number.isRequired,
        month: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired
    }).isRequired,
    latestTransaction: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
    setPageControls: PropTypes.func,
    setPageTitle: PropTypes.func,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            categories: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    colour: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired
                })
            ),
            date: PropTypes.number.isRequired,
            description: PropTypes.string,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            reference: PropTypes.string,
            vendor: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                pattern: PropTypes.string.isRequired
            })
        })
    ).isRequired,
    setTransactionFilter: PropTypes.func.isRequired,
    uncategorisedTransactions: PropTypes.array.isRequired
};

const mapStateToProps = createStructuredSelector({
    earliestTransaction,
    filter: selectTransactionFilter,
    latestTransaction,
    transactions: selectFilteredTransactionsExpanded,
    uncategorisedTransactions: selectUncategorisedTransactionsExpanded
});

const mapDispatchToProps = mapDispatchToPropsComposer({
    setTransactionFilter
});

Transactions = connect(mapStateToProps, mapDispatchToProps)(Transactions);

export default Transactions;
