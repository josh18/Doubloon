import { fromJS } from 'immutable';

import {
    CREATE_CATEGORY,
    UPDATE_CATEGORY
} from './actions';

const initialState = fromJS({});

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_CATEGORY: {
            let id = Object.keys(state.toJS()).reduce((maxId, category) => {
                return Math.max(category, maxId);
            }, 0) + 1;
            id = id.toString();

            return state.set(id, fromJS({
                name: action.name,
                colour: action.colour
            }));
        }
        case UPDATE_CATEGORY: {
            return state.set(action.id, fromJS({
                name: action.name,
                colour: action.colour
            }));
        }
        default:
            return state;
    }
}

export default categoriesReducer;
