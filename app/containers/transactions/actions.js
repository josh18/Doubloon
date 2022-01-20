export const IMPORT_TRANSACTIONS = 'IMPORT_TRANSACTIONS';
export const CATEGORISE_TRANSACTION = 'CATEGORISE_TRANSACTION';
export const SET_TRANSACTION_FILTER = 'SET_TRANSACTION_FILTER';

export function importTransactions(transactions, vendors, categoriesTransactions, transactionsVendors) {
    return {
        type: IMPORT_TRANSACTIONS,
        categoriesTransactions,
        transactions,
        transactionsVendors,
        vendors
    };
}

export function categoriseTransaction(id, categories) {
    return {
        type: CATEGORISE_TRANSACTION,
        id,
        categories
    };
}

export function setTransactionFilter(month, year) {
    return {
        type: SET_TRANSACTION_FILTER,
        month,
        year
    };
}
