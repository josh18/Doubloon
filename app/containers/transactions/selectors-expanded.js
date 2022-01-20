import { createSelector } from 'reselect';

import mapRelationship from 'utils/map-relationship';

import { selectTransactionsObject, selectTransactions, selectFilteredTransactions } from './selectors';
import { selectCategoriesObject } from 'containers/categories/selectors';
import { selectVendorsObject } from 'containers/vendors/selectors';
import { selectCategoriesTransactions } from 'relationships/categories-transactions/selectors';
import { selectTransactionsVendors } from 'relationships/transactions-vendors/selectors';

export const selectTransactionsExpanded = createSelector(
    selectTransactions,
    selectCategoriesObject,
    selectVendorsObject,
    selectCategoriesTransactions,
    selectTransactionsVendors,
    (transactions, categories, vendors, categoriesTransactions, transactionsVendors) => {
        transactions = mapRelationship({
            main: transactions,
            related: categories,
            relationship: {
                list: categoriesTransactions,
                mainId: 'transactionId',
                relatedId: 'categoryId',
                type: 'multiple'
            },
            name: 'categories'
        });

        transactions = mapRelationship({
            main: transactions,
            related: vendors,
            relationship: {
                list: transactionsVendors,
                mainId: 'transactionId',
                relatedId: 'vendorId',
                type: 'single'
            },
            name: 'vendor'
        });

        return transactions;
    }
);

export const selectTransactionsWithCategories = createSelector(
    selectTransactionsObject,
    selectCategoriesObject,
    selectCategoriesTransactions,
    (transactions, categories, categoriesTransactions) => {
        transactions = mapRelationship({
            main: transactions,
            related: categories,
            relationship: {
                list: categoriesTransactions,
                mainId: 'transactionId',
                relatedId: 'categoryId',
                type: 'multiple'
            },
            name: 'categories'
        });

        return transactions;
    }
);

export const selectTransactionsWithVendors = createSelector(
    selectTransactionsObject,
    selectVendorsObject,
    selectTransactionsVendors,
    (transactions, vendors, transactionsVendors) => {
        transactions = mapRelationship({
            main: transactions,
            related: vendors,
            relationship: {
                list: transactionsVendors,
                mainId: 'transactionId',
                relatedId: 'vendorId',
                type: 'single'
            },
            name: 'vendor'
        });

        return transactions;
    }
);

export const selectUncategorisedTransactionsExpanded = createSelector(
    selectTransactions,
    selectCategoriesObject,
    selectVendorsObject,
    selectCategoriesTransactions,
    selectTransactionsVendors,
    (transactions, categories, vendors, categoriesTransactions, transactionsVendors) => {
        transactions = mapRelationship({
            main: transactions,
            related: categories,
            relationship: {
                list: categoriesTransactions,
                mainId: 'transactionId',
                relatedId: 'categoryId',
                type: 'multiple'
            },
            name: 'categories'
        });

        transactions = mapRelationship({
            main: transactions,
            related: vendors,
            relationship: {
                list: transactionsVendors,
                mainId: 'transactionId',
                relatedId: 'vendorId',
                type: 'single'
            },
            name: 'vendor'
        });

        // Filter out transactions that are already categorised
        transactions = transactions.filter((transaction) => {
            return !transaction.categories.length;
        });

        return transactions;
    }
);

export const selectFilteredTransactionsExpanded = createSelector(
    selectFilteredTransactions,
    selectCategoriesObject,
    selectVendorsObject,
    selectCategoriesTransactions,
    selectTransactionsVendors,
    (transactions, categories, vendors, categoriesTransactions, transactionsVendors) => {
        transactions = mapRelationship({
            main: transactions,
            related: categories,
            relationship: {
                list: categoriesTransactions,
                mainId: 'transactionId',
                relatedId: 'categoryId',
                type: 'multiple'
            },
            name: 'categories'
        });

        transactions = mapRelationship({
            main: transactions,
            related: vendors,
            relationship: {
                list: transactionsVendors,
                mainId: 'transactionId',
                relatedId: 'vendorId',
                type: 'single'
            },
            name: 'vendor'
        });

        return transactions;
    }
);
