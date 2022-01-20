import { createSelector } from 'reselect';

export const selectVendor = (state, props) => {
    if (state.getIn(['vendors', props.id])) {
        return state.getIn(['vendors', props.id]).toJS();
    }
};

export const selectVendorsObject = (state) => {
    let vendors = state.get('vendors').toJS();

    Object.entries(vendors).forEach(([id]) => {
        vendors[id].id = id;
    });

    return vendors;
};

export const selectVendors = createSelector(
    selectVendorsObject,
    (vendors) => {
        // Convert to array
        vendors = Object.entries(vendors).map(([, vendor]) => {
            return vendor;
        });

        return vendors;
    }
);
