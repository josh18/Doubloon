import { fromJS } from 'immutable';

import {
    IMPORT_TRANSACTIONS,
    SET_TRANSACTION_FILTER
} from './actions';

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const initialState = fromJS({
    earliestTransaction: false,
    filter: {
        month: currentMonth,
        year: currentYear,
    },
    latestTransaction: false,
    transactions: {}
});

function transactionsReducer(state = initialState, action) {
    switch (action.type) {
        case IMPORT_TRANSACTIONS: {
            action.transactions.forEach((transaction) => {
                let transactionDate = new Date(transaction.date).valueOf();

                // Set earliest transaction
                if (!state.get('earliestTransaction') || transactionDate < state.get('earliestTransaction')) {
                    state = state.set('earliestTransaction', transactionDate);
                }

                // Set latest transaction
                if (!state.get('latestTransaction') || transactionDate > state.get('latestTransaction')) {
                    state = state.set('latestTransaction', transactionDate);
                }

                // Save new transaction
                state = state.setIn(['transactions', transaction.id], fromJS(transaction));
            });

            return state;
        }
        case SET_TRANSACTION_FILTER: {
            state = state.setIn(['filter', 'month'], action.month);
            state = state.setIn(['filter', 'year'], action.year);

            return state;
        }
        default:
            return state;
    }
}

export default transactionsReducer;
