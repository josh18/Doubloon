import { createSelector } from 'reselect';

export const makeSelectCategory = () => {
    return (state, props) => {
        if (state.getIn(['categories', props.id])) {
            return state.getIn(['categories', props.id]).toJS();
        }
    };
};

export const selectCategoriesObject = (state) => {
    let categories = state.get('categories').toJS();

    Object.entries(categories).forEach(([id]) => {
        categories[id].id = id;
    });

    return categories;
};

export const selectCategories = createSelector(
    selectCategoriesObject,
    (categories) => {
        // Convert to array
        categories = Object.entries(categories).map(([, category]) => {
            return category;
        });

        return categories;
    }
);
