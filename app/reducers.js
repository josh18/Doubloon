import { combineReducers } from 'redux-immutable';

// Container reducers
import categories from 'containers/categories/reducer';
import transactions from 'containers/transactions/reducer';
import vendors from 'containers/vendors/reducer';

// Relationship reducers
import categoriesTransactions from 'relationships/categories-transactions/reducer';
import transactionsVendors from 'relationships/transactions-vendors/reducer';

// To allow replacing the entire state
import makeHydratable from 'containers/settings/reducer';
import { IMPORT_DATA } from 'containers/settings/actions';

let rootReducer = combineReducers({
    categories,
    categoriesTransactions,
    transactions,
    transactionsVendors,
    vendors
});

rootReducer = makeHydratable(rootReducer, IMPORT_DATA);

export default rootReducer;
