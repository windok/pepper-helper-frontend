import {createStore, applyMiddleware, compose} from 'redux';

import reducers from 'Reducers';

import thunk from 'redux-thunk';
import {apiMiddleware} from './api-middleware';

import {offline} from 'redux-offline';
import getOfflineConfig from './offlineConfig';

const middleware = [
    thunk,
    apiMiddleware
];

const store = createStore(reducers, compose(
    applyMiddleware(...middleware),
    offline(getOfflineConfig()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
));

export default store;