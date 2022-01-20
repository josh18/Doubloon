import { fromJS } from 'immutable';

import {
    CATEGORISE_TRANSACTION,
    IMPORT_TRANSACTIONS
} from 'containers/transactions/actions';

const initialState = fromJS([]);

function categoriesTransactionsReducer(state = initialState, action) {
    switch (action.type) {
        case CATEGORISE_TRANSACTION: {
            action.categories.forEach((category) => {
                state = state.push(fromJS({
                    categoryId: category,
                    transactionId: action.id
                }));
            });

            return state;
        }
        case IMPORT_TRANSACTIONS: {
            action.categoriesTransactions.forEach((relationship) => {
                // Save new relationship
                state = state.push(fromJS(relationship));
            });

            return state;
        }
        default:
            return state;
    }
}

export default categoriesTransactionsReducer;
