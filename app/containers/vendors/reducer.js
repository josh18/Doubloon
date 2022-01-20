import { fromJS } from 'immutable';

import {
    CREATE_VENDOR,
    UPDATE_VENDOR
} from './actions';

import {
    IMPORT_TRANSACTIONS,
} from 'containers/transactions/actions';

const initialState = fromJS({});

function vendorsReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_VENDOR:
        case UPDATE_VENDOR: {
            return state.set(action.id, fromJS({
                autoCategorise: action.autoCategorise,
                categories: action.categories,
                name: action.name,
                pattern: action.pattern
            }));
        }
        case IMPORT_TRANSACTIONS: {
            action.vendors.forEach((vendor) => {
                vendor.categories = [];

                // Save new vendor
                state = state.set(vendor.id, fromJS(vendor));
            });

            return state;
        }
        default:
            return state;
    }
}

export default vendorsReducer;
