// Modules
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import QuickSelect from 'elements/quick-select/quick-select';

// Utils
import { formatCurrency, formatDate } from 'utils/format';
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';

// Actions
import { categoriseTransaction } from '../actions';

// Selectors
import { selectCategories } from 'containers/categories/selectors';
import { selectUncategorisedTransactionsExpanded } from '../selectors-expanded';

// TODO: Breadcrumbs
// TODO: Add pattern to existing vendor

// Styles
import styles from './categorise.less';

class Categorise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTransaction: 0,
            selectedCategories: [],
            totalTransactions: props.transactions.length
        };
    }

    componentWillReceiveProps() {
        this.updateFromParent = true;
    }

    componentDidUpdate() {
        if (this.updateFromParent && this.quickSelectElement) {
            this.quickSelectElement.openDropdown(true);
            this.updateFromParent = false;
        }
    }

    handleCategoryChange = (value) => {
        this.setState({
            selectedCategories: value
        });
    }

    skip = () => {
        let activeTransaction = this.state.activeTransaction;
        activeTransaction++;

        this.setState({
            activeTransaction,
            selectedCategories: []
        });
    }

    save = () => {
        let transactions = this.props.transactions;

        let {
            activeTransaction,
            selectedCategories
        } = this.state;

        let transaction = transactions[activeTransaction];

        this.setState({selectedCategories: []});

        this.props.categoriseTransaction(transaction.id, selectedCategories);
    }

    render() {
        let transactions = this.props.transactions;

        let {
            activeTransaction,
            selectedCategories,
            totalTransactions
        } = this.state;

        // Sort by date
        transactions.sort((a, b) => {
            return a.date - b.date;
        });

        let transaction = transactions[activeTransaction];

        let transactionsToGo = totalTransactions - (transactions.length - (activeTransaction + 1));

        if (transaction) {
            let {
                amount,
                date,
                description,
                reference,
                vendor
            } = transaction;

            let amountClass = classNames({
                amount: true,
                'is-negative': amount < 0,
                'is-positive': amount > 0
            });

            amount = formatCurrency(amount);
            date = formatDate(date);

            let progressStyle = {
                width: Math.round(transactionsToGo / totalTransactions * 100) + '%'
            };

            return (
                <div styleName="categorise">
                    <div styleName="info-controls">
                        <div styleName="info">
                            <h2 styleName={amountClass}>{amount}</h2>
                            <div styleName="vendor-date">{vendor.name} - {date}</div>

                            <div styleName="description">Description: {description}</div>
                            <div styleName="reference">Reference: {reference}</div>
                        </div>

                        <div styleName="controls">
                            <div styleName="progress-indicator">
                                <div styleName="progress-bar" style={progressStyle} />
                            </div>
                            <div styleName="progress-count">{transactionsToGo} of {totalTransactions}</div>
                            <div styleName="actions">
                                <button styleName="action-skip" onClick={this.skip}>Skip</button>
                                <button styleName="action-save" onClick={this.save}>Save</button>
                            </div>
                        </div>
                    </div>
                    <QuickSelect className={styles['quick-select']} label="Add Categories" options={this.props.categories} selected={selectedCategories} autoFocus onChange={this.handleCategoryChange} ref={element => this.quickSelectElement = element} />
                </div>
            );
        } else {
            return <Redirect push to="/transactions" />;
        }
    }
}

Categorise.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            colour: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    categoriseTransaction: PropTypes.func.isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            date: PropTypes.number.isRequired,
            description: PropTypes.string,
            reference: PropTypes.string,
            vendor: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                pattern: PropTypes.string.isRequired
            })
        })
    ).isRequired,
};

const mapStateToProps = createStructuredSelector({
    categories: selectCategories,
    transactions: selectUncategorisedTransactionsExpanded
});

const mapDispatchToProps = mapDispatchToPropsComposer({
    categoriseTransaction
});

Categorise = CSSModules(Categorise, styles);
Categorise = connect(mapStateToProps, mapDispatchToProps)(Categorise);

export default Categorise;
