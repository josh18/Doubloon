import { createSelector } from 'reselect';

import mapRelationship from 'utils/map-relationship';

import { selectCategories } from './selectors';
import { selectTransactionsWithVendors } from 'containers/transactions/selectors-expanded';
import { selectCategoriesTransactions } from 'relationships/categories-transactions/selectors';

export const selectCategoriesExpanded = createSelector(
    selectCategories,
    selectTransactionsWithVendors,
    selectCategoriesTransactions,
    (categories, transactions, categoriesTransactions) => {
        categories = mapRelationship({
            main: categories,
            related: transactions,
            relationship: {
                list: categoriesTransactions,
                mainId: 'categoryId',
                relatedId: 'transactionId',
                type: 'multiple'
            },
            name: 'transactions'
        });

        return categories;
    }
);
