// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import CategoryTag from 'elements/category-tag/category-tag';

// Utils
import { formatCurrency } from 'utils/format';

// Styles
import styles from '../styles.less';

class Transaction extends Component {
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
        if (this.transactionElement !== e.target && !this.transactionElement.contains(e.target) && document.contains(e.target)) {
            this.setState({
                open: false
            });
        }
    }

    toggleDetails = () => {
        this.setState({
            open: !this.state.open
        });
    }

    preventFocus = (e) => {
        e.preventDefault();
    }

    render() {
        let {
            amount,
            categories,
            description,
            name,
            reference
        } = this.props;

        let open = this.state.open;

        let transactionClass = classNames({
            transaction: true,
            'is-open': open
        });

        let amountClass = classNames({
            amount: true,
            'is-negative': amount < 0,
            'is-positive': amount > 0
        });

        amount = formatCurrency(amount);

        categories = categories.map((category, i) => {
            return <CategoryTag {...category} key={i} />;
        });

        return (
            <li styleName={transactionClass} tabIndex="0" ref={element => this.transactionElement = element} onMouseDown={this.preventFocus}>
                <div styleName="summary" onClick={this.toggleDetails}>
                    <div styleName="name">{name}</div>
                    <div styleName="categories">
                        {categories}
                    </div>
                    <div styleName={amountClass}>{amount}</div>
                </div>
                <div styleName="details">
                    <div>{description}</div>
                    <div>{reference}</div>
                </div>
            </li>
        );
    }
}

Transaction.propTypes = {
    amount: PropTypes.number.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            colour: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    description: PropTypes.string,
    name: PropTypes.string.isRequired,
    reference: PropTypes.string
};

Transaction = CSSModules(Transaction, styles);

export default Transaction;
