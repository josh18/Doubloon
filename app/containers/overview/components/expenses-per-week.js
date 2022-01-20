// Modules
import React, { Component, PropTypes } from 'react';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Elements
import StatsBar from 'elements/stats-bar/stats-bar';

// Styles
import styles from '../styles.less';

class ExpensesPerWeek extends Component {
    chartData = () => {
        function addCategory(categories, amount, name, colour) {
            if (amount < 0) {
                if (!categories[name]) {
                    categories[name] = {
                        amount: 0,
                        colour
                    };
                }

                categories[name].amount += Math.abs(amount);
                // toFixed() is to deal with adding float issues
                categories[name].amount = parseFloat(categories[name].amount.toFixed(2));
            }

            return categories;
        }

        let {
            latestTransaction: endRange,
            transactions
        } = this.props;

        // Set start range to 12 weeks ago
        let startRange = new Date(endRange);
        startRange.setDate(startRange.getDate() - (12 * 7));
        startRange = startRange.getTime();

        transactions = transactions.filter(({date}) => {
            return date > startRange;
        });

        let categoriesData = {};

        transactions.forEach(({amount, categories}) => {
            if (categories.length) {
                categories.forEach(({name, colour}) => {
                    categoriesData = addCategory(categoriesData, amount, name, colour);
                });
            } else {
                categoriesData = addCategory(categoriesData, amount, 'Uncategorised', '#666');
            }
        });

        let categoriesDataArray = [];
        let maxAmount = 0;
        Object.entries(categoriesData).forEach(([name, {amount, colour}]) => {
            // Cost per week
            amount = Math.round(amount / 12);
            maxAmount = Math.max(maxAmount, amount);

            categoriesDataArray.push({
                amount,
                colour,
                name
            });
        });

        categoriesData = categoriesDataArray;
        maxAmount = Math.ceil(maxAmount / 10) * 10;

        // Add max to each category
        categoriesData = categoriesData.map((category) => {
            category.max = maxAmount;
            return category;
        });

        // Sort by amount
        categoriesData.sort((a, b) => {
            return b.amount - a.amount;
        });

        return categoriesData;
    }

    render() {
        let bars = this.chartData().map((category, i) => {
            return <StatsBar className={styles['bars-category']} {...category} key={i} />;
        });

        let amounts = this.chartData().map(({amount, colour}, i) => {
            return (
                <div styleName="amount" key={i}>
                    <div styleName="amount-colour" style={{backgroundColor: colour}}></div>
                    <div styleName="amount-name">$ {amount}</div>
                </div>
            );
        });

        return (
            <div styleName="expenses-per-week">
                <h2>Categorised Expenses</h2>
                <div styleName="sub-heading">Average costs per week over the last 12 weeks</div>
                <div styleName="expenses-per-week-content">
                    <div styleName="bars">
                        {bars}
                    </div>
                    <div styleName="amounts">
                        {amounts}
                    </div>
                </div>
            </div>
        );
    }
}

ExpensesPerWeek.propTypes = {
    latestTransaction: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            categories: PropTypes.arrayOf(
                PropTypes.shape({
                    colour: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired
                })
            ),
            date: PropTypes.number.isRequired,
            vendor: PropTypes.shape({
                name: PropTypes.string.isRequired,
            })
        })
    ).isRequired,
};

ExpensesPerWeek = CSSModules(ExpensesPerWeek, styles);

export default ExpensesPerWeek;
