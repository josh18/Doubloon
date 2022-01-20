export const IMPORT_DATA = 'IMPORT_DATA';

export function importData(data) {
    return {
        type: IMPORT_DATA,
        data
    };
}
