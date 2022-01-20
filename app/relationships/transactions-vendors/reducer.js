import { fromJS } from 'immutable';

import {
    IMPORT_TRANSACTIONS,
} from 'containers/transactions/actions';

const initialState = fromJS([]);

function transactionsVendorsReducer(state = initialState, action) {
    switch (action.type) {
        case IMPORT_TRANSACTIONS: {
            action.transactionsVendors.forEach((relationship) => {
                // Save new relationship
                state = state.push(fromJS(relationship));
            });

            return state;
        }
        default:
            return state;
    }
}

export default transactionsVendorsReducer;
