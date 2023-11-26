/*
 * @file: configureStore.prod.js
 * @description: Configure/creating redux store with thunk,reducer etc
 * @author: Mohit Kumar
 * */

import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import reducers from '../reducers';

export default history => {
    const store = createStore(reducers, compose(applyMiddleware(thunk, routerMiddleware(history))));
    const persistor = persistStore(store);
    return { persistor, store };
};
