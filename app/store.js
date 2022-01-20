import Immutable from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist-immutable';

import rootReducer from 'reducers';
const preloadedState = Immutable.Map();

// Create store
const store = createStore(
    rootReducer,
    preloadedState,
    compose(
        applyMiddleware(thunk),
        autoRehydrate()
    )
);

export default store;

export function loadStore(callback) {
    persistStore(
        store,
        {},
        () => callback(store)
    );
}

if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers').default);
    });
}
