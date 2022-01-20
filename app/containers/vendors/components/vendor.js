// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';
import Link from 'wrappers/link';

// Elements
import CategoryTag from 'elements/category-tag/category-tag';
import Icon from 'elements/icon/icon';

// Utils
import { formatCurrency, formatDate } from 'utils/format';

// Styles
import styles from '../styles.less';

function Transactions({transactions}) {
    if (!transactions.length) {
        return (
            <div styleName="transactions is-empty">
                No recent transactions.
            </div>
        );
    }

    // Sort by date
    transactions.sort((a, b) => {
        return b.date - a.date;
    });

    // Limit to 10 most recent
    transactions = transactions.slice(0, 5);

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
        return b.date - a.date;
    });

    transactionDays = transactionDays.map(({date, transactions}, i) => {
        transactions = transactions.map(({amount, categories}, ii) => {

            let amountClass = classNames({
                'transaction-amount': true,
                'is-negative': amount < 0,
                'is-positive': amount > 0
            });

            amount = formatCurrency(amount);

            categories = categories.map((category, iii) => {
                return <CategoryTag {...category} key={iii} />;
            });

            return (
                <li styleName="transaction" key={ii}>
                    <div styleName={amountClass}>{amount}</div>
                    <div styleName="transaction-categories">{categories}</div>
                </li>
            );
        });

        date = formatDate(date);

        return (
            <li styleName="transaction-day" key={i}>
                <h3>{date}</h3>
                <ol styleName="transaction-day-transactions">
                    {transactions}
                </ol>
            </li>
        );
    });

    return (
        <ol styleName="transactions">
            {transactionDays}
        </ol>
    );
}

Transactions = CSSModules(Transactions, styles);

Transactions.propTypes = {
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
};

function CategoriesList({categories}) {
    categories = categories.map((category, i) => {
        return <CategoryTag {...category} key={i} />;
    });

    return (
        <div styleName="categories">
            {categories}
        </div>
    );
}

CategoriesList.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
};

CategoriesList = CSSModules(CategoriesList, styles);

class Vendor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleGlobalEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleGlobalEvent);
    }

    handleGlobalEvent = (e) => {
        if (this.vendorElement !== e.target && !this.vendorElement.contains(e.target) && document.contains(e.target)) {
            this.setState({
                open: false
            });
        }
    }

    toggleTransactions = () => {
        this.setState({
            open: !this.state.open
        });
    }

    preventFocus = (e) => {
        e.preventDefault();
    }

    render() {
        let {
            autoCategorise,
            categories,
            id,
            match,
            name,
            transactions
        } = this.props;

        let open = this.state.open;

        let vendorClass = classNames({
            vendor: true,
            'is-open': open
        });

        let autoIndicator;
        if (autoCategorise) {
            autoIndicator = <Icon styleName="auto-indicator" type="lightning" size={16} />;
        }

        return (
            <li styleName={vendorClass} tabIndex="0" ref={element => this.vendorElement = element} onMouseDown={this.preventFocus}>
                <div styleName="info" onClick={this.toggleTransactions}>
                    <h2>{name}</h2>
                    {autoIndicator}
                    <Link styleName="edit-action" to={`${match.url}/${id}`} onClick={(e) => e.stopPropagation()}>
                        <Icon type="edit" size={16} />
                    </Link>
                    <CategoriesList categories={categories} />
                </div>
                <Transactions transactions={transactions} />
            </li>
        );
    }
}

Vendor.propTypes = {
    autoCategorise: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    id: PropTypes.string.isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
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
};

Vendor = CSSModules(Vendor, styles);

export default Vendor;
