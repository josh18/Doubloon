// Modules
import React, { Component, PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';
import Link from 'wrappers/link';

// Utils
import { formatDate } from 'utils/format';

// Styles
import styles from '../styles.less';

// Components
import Filter from './filter';
import Transaction from './transaction';

function TransactionsCategorise({uncategorisedTransactions}) {
    if (uncategorisedTransactions.length > 0) {
        // TODO: Fix pluralisation
        return <Link className={styles.categorise} to="/transactions/categorise">Categorise {uncategorisedTransactions.length} transactions</Link>;
    }

    return null;
}

TransactionsCategorise.propTypes = {
    uncategorisedTransactions: PropTypes.array.isRequired
};

function TransactionDays({date, transactions}) {
    transactions = transactions.map((transaction, i) => {
        return <Transaction {...transaction} key={i} />;
    });

    date = formatDate(date);

    return (
        <li styleName="transaction-day">
            <h2>{date}</h2>
            <ol styleName="transaction-day-transactions">
                {transactions}
            </ol>
        </li>
    );
}

TransactionDays.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            description: PropTypes.string,
            name: PropTypes.string.isRequired,
            reference: PropTypes.string
        })
    ).isRequired,
    date: PropTypes.number.isRequired
};

TransactionDays = CSSModules(TransactionDays, styles);

class TransactionsList extends Component {
    componentWillMount() {
        this.updateFilter(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.month !== this.props.month || nextProps.year !== this.props.year) {
            this.updateFilter(nextProps);
        }
    }

    updateFilter = (props) => {
        let {
            filter,
            latestTransaction,
            month,
            setFilter,
            year
        } = props;

        if (month && year) {
            // 1-12 --> 0-11
            month--;
        } else {
            let now = new Date();
            if (latestTransaction && now.valueOf() > latestTransaction) {
                now = new Date(latestTransaction);
            }

            month = now.getMonth();
            year = now.getFullYear();
        }

        if (month !== filter.month || year !== filter.year) {
            setFilter(month, year);
        }
    }

    render() {
        let {
            filter,
            routerPush,
            transactions,
            uncategorisedTransactions
        } = this.props;

        let transactionsList;
        if (transactions.length) {
            // Group objects by date
            let transactionDays = {};
            transactions.forEach((transaction) => {
                if (!transactionDays[transaction.date]) {
                    transactionDays[transaction.date] = [];
                }

                transactionDays[transaction.date].push(transaction);
            });

            // Turn object into array
            transactionDays = Object.entries(transactionDays).map(([date, transactions]) => {
                return {
                    date: parseInt(date),
                    transactions
                };
            });

            // Sort by date
            transactionDays.sort((a, b) => {
                return a.date - b.date;
            });

            transactionDays = transactionDays.map((transactionDay, i) => {
                return <TransactionDays transactions={transactionDay.transactions} date={transactionDay.date} key={i} />;
            });

            transactionsList = (
                <ol styleName="transactions-list">
                    {transactionDays}
                </ol>
            );
        } else {
            transactionsList = <div styleName="empty">No transactions to show.</div>;
        }

        return (
            <div>
                <TransactionsCategorise uncategorisedTransactions={uncategorisedTransactions} />
                <Filter {...filter} routerPush={routerPush} />
                {transactionsList}
            </div>
        );
    }
}

TransactionsList.propTypes = {
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
    month: PropTypes.number,
    routerPush: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            date: PropTypes.number.isRequired,
            description: PropTypes.string,
            name: PropTypes.string.isRequired,
            reference: PropTypes.string
        })
    ).isRequired,
    uncategorisedTransactions: PropTypes.array.isRequired,
    year: PropTypes.number
};

TransactionsList = CSSModules(TransactionsList, styles);

export default TransactionsList;
