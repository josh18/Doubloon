import { createSelector } from 'reselect';

import mapRelationship from 'utils/map-relationship';

import { selectVendor, selectVendors } from './selectors';
import { selectCategoriesObject } from 'containers/categories/selectors';
import { selectTransactionsWithCategories } from 'containers/transactions/selectors-expanded';
import { selectTransactionsVendors } from 'relationships/transactions-vendors/selectors';

export const makeSelectVendorExpanded = () => {
    return createSelector(
        selectVendor,
        selectCategoriesObject,
        (vendor, categories) => {
            if (vendor) {
                vendor.categories = vendor.categories.map((categoryId) => {
                    return categories[categoryId];
                });

                return vendor;
            }
        }
    );
};

export const selectVendorsExpanded = createSelector(
    selectVendors,
    selectCategoriesObject,
    selectTransactionsWithCategories,
    selectTransactionsVendors,
    (vendors, categories, transactions, transactionsVendors) => {
        vendors = vendors.map((vendor) => {
            vendor.categories = vendor.categories.map((categoryId) => {
                return categories[categoryId];
            });

            return vendor;
        });

        // let transactionsObject = {};
        // transactions.forEach((transaction) => {
        //     transactionsObject[transaction.id] = transaction;
        // });

        vendors = mapRelationship({
            main: vendors,
            related: transactions,
            relationship: {
                list: transactionsVendors,
                mainId: 'vendorId',
                relatedId: 'transactionId',
                type: 'multiple'
            },
            name: 'transactions'
        });

        return vendors;
    }
);
