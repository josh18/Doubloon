// Modules
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Utils
import mapDispatchToPropsComposer from 'utils/map-dispatch-to-props';

// Actions
import { importData } from 'containers/settings/actions';

// Selectors
import { latestTransaction } from 'containers/transactions/selectors';
import { selectTransactionsExpanded } from 'containers/transactions/selectors-expanded';

// Styles
import styles from './styles.less';

// Components
import Demo from 'containers/settings/components/demo';

// Components
import ExpensesPerWeek from './components/expenses-per-week';
import ExpensesvsIncome from './components/expenses-vs-income';

class Overview extends Component {
    componentDidMount() {
        this.props.setPageTitle('Overview');
    }

    componentWillUnmount() {
        this.props.setPageTitle();
    }

    render() {
        let {
            history: {
                push
            },
            importData,
            latestTransaction,
            transactions
        } = this.props;

        if (transactions.length) {
            return (
                <div>
                    <ExpensesPerWeek latestTransaction={latestTransaction} transactions={transactions} />
                    <ExpensesvsIncome latestTransaction={latestTransaction} transactions={transactions} />
                </div>
            );
        }

        return (
            <div styleName="empty">
                <Demo importData={importData} routerPush={push} />
            </div>
        );
    }
}

Overview.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    importData: PropTypes.func.isRequired,
    latestTransaction: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
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
            vendor: PropTypes.shape({
                name: PropTypes.string.isRequired,
            })
        })
    ).isRequired,
};

const mapDispatchToProps = mapDispatchToPropsComposer({
    importData,
});

const mapStateToProps = createStructuredSelector({
    latestTransaction,
    transactions: selectTransactionsExpanded
});

Overview = CSSModules(Overview, styles);
Overview = connect(mapStateToProps, mapDispatchToProps)(Overview);

export default Overview;
