import store from 'store';

import { selectVendors } from './selectors';

export const CREATE_VENDOR = 'CREATE_VENDOR';
export const UPDATE_VENDOR = 'UPDATE_VENDOR';

export function createVendor(name, pattern, categories, autoCategorise) {
    const vendors = selectVendors(store.getState());

    let id = vendors.reduce((maxId, vendor) => {
        return Math.max(vendor.id, maxId);
    }, 0) + 1;
    id = id.toString();

    return {
        type: CREATE_VENDOR,
        id,
        name,
        pattern,
        categories,
        autoCategorise
    };
}

export function updateVendor(id, name, pattern, categories, autoCategorise) {
    return {
        type: UPDATE_VENDOR,
        id,
        name,
        pattern,
        categories,
        autoCategorise
    };
}
