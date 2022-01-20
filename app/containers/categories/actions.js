export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';

export function createCategory(name, colour) {
    return {
        type: CREATE_CATEGORY,
        name,
        colour
    };
}

export function updateCategory(id, name, colour) {
    return {
        type: UPDATE_CATEGORY,
        id,
        name,
        colour
    };
}
