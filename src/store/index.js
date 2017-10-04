import {createStore, applyMiddleware, compose} from 'redux';

import reducers from 'Reducers';

import thunk from 'redux-thunk';
import {apiMiddleware as restApiMiddleware} from './api-middleware';
import {socketMiddleware as socketApiMiddleware} from './socket-middleware';

import {offline} from 'redux-offline';
import getOfflineConfig from './offlineConfig';

const middleware = [
    thunk,
    restApiMiddleware,
    socketApiMiddleware
];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancer(
    applyMiddleware(...middleware),
    offline(getOfflineConfig()),
));

export default store;