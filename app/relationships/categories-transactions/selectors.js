export const selectCategoriesTransactions = (state) => {
    return state.get('categoriesTransactions').toJS();
};
