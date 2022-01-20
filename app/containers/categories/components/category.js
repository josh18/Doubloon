// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';
import Link from 'wrappers/link';

// Elements
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
        transactions = transactions.map(({amount, vendor}, ii) => {

            let amountClass = classNames({
                'transaction-amount': true,
                'is-negative': amount < 0,
                'is-positive': amount > 0
            });

            amount = formatCurrency(amount);

            return (
                <li styleName="transaction" key={ii}>
                    <div styleName="transaction-name">{vendor.name}</div>
                    <div styleName={amountClass}>{amount}</div>
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
            date: PropTypes.number.isRequired,
            vendor: PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired
        })
    ).isRequired
};

class Category extends Component {
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
        if (this.categoryEelement !== e.target && !this.categoryEelement.contains(e.target) && document.contains(e.target)) {
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
            colour,
            id,
            match,
            name,
            transactions
        } = this.props;

        let open = this.state.open;

        let categoryStyle = {
            backgroundColor: colour
        };

        let categoryClass = classNames({
            category: true,
            'is-open': open
        });

        return (
            <li styleName={categoryClass} tabIndex="0" ref={element => this.categoryEelement = element} onMouseDown={this.preventFocus}>
                <div styleName="info" onClick={this.toggleTransactions}>
                    <div styleName="colour" style={categoryStyle}></div>
                    <h2>{name}</h2>
                    <Link styleName="edit-action" to={`${match.url}/${id}`} onClick={(e) => e.stopPropagation()}>
                        <Icon type="edit" size={16} />
                    </Link>
                </div>
                <Transactions transactions={transactions} />
            </li>
        );
    }
}

Category.propTypes = {
    colour: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
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
};

Category = CSSModules(Category, styles);

export default Category;
