import { fromJS } from 'immutable';

function makeHydratable(reducer, hydrateActionType) {
    return function(state, action) {
        switch (action.type) {
            case hydrateActionType:
                return reducer(fromJS(action.data), action);
            default:
                return reducer(state, action);
        }
    };
}

export default makeHydratable;
