export const selectTransactionsVendors = (state) => {
    return state.get('transactionsVendors').toJS();
};
