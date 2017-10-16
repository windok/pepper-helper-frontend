import {createStore, applyMiddleware, compose} from 'redux';

import reducers from 'Reducers';

import thunk from 'redux-thunk';
import {apiMiddleware as restApiMiddleware} from './api-middleware';
import {socketMiddleware as socketApiMiddleware} from './socket-middleware';

import {autoRehydrate} from 'redux-persist';

import rootEpic from './epics';
import {createEpicMiddleware} from 'redux-observable';

const middleware = [
    thunk,
    createEpicMiddleware(rootEpic),
    restApiMiddleware,
    socketApiMiddleware,
];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancer(
    applyMiddleware(...middleware),
    autoRehydrate()
));

export default store;