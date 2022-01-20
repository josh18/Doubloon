import { createSelector } from 'reselect';

export const filter = (state) => {
    return state.getIn(['transactions', 'filter']).toJS();
};

export const earliestTransaction = (state) => {
    return state.getIn(['transactions', 'earliestTransaction']);
};

export const latestTransaction = (state) => {
    return state.getIn(['transactions', 'latestTransaction']);
};

export const transactions = (state) => {
    return state.getIn(['transactions', 'transactions']).toJS();
};

export const selectTransactionFilter = createSelector(
    filter,
    earliestTransaction,
    latestTransaction,
    (filter, earliestTransaction, latestTransaction) => {
        // Set minYear to earliest transaction year or this year
        if (earliestTransaction) {
            filter.minYear = new Date(earliestTransaction).getFullYear();
        } else {
            filter.minYear = new Date().getFullYear();
        }

        // Set maxYear to latest transaction year or this year
        if (latestTransaction) {
            filter.maxYear = new Date(latestTransaction).getFullYear();
        } else {
            filter.maxYear = new Date().getFullYear();
        }

        return filter;
    }
);

export const selectTransactionsObject = createSelector(
    transactions,
    (transactions) => {
        Object.entries(transactions).forEach(([id]) => {
            transactions[id].id = id;
        });

        return transactions;
    }
);

export const selectTransactions = createSelector(
    selectTransactionsObject,
    (transactions) => {
        // Convert to array
        transactions = Object.entries(transactions).map(([, transaction]) => {
            return transaction;
        });

        return transactions;
    }
);

export const selectFilteredTransactions = createSelector(
    selectTransactions,
    selectTransactionFilter,
    (transactions, filter) => {
        transactions = transactions.filter(({date}) => {
            let transactionDate = new Date(date);

            // Filter out transactions that are outside of the current month
            return transactionDate.getFullYear() === filter.year && transactionDate.getMonth() === filter.month;
        });

        return transactions;
    }
);
