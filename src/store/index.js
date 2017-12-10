import {createStore, applyMiddleware, compose} from 'redux';

import reducers from 'Reducers';

import thunk from 'redux-thunk';
import {timeInjectorMiddleware} from "./time-injector-middleware";
import {apiMiddleware as restApiMiddleware} from './api-middleware';
import {socketMiddleware as socketApiMiddleware} from './socket-middleware';

import rootEpic from './epics';
import {createEpicMiddleware} from 'redux-observable';

import persistConfig from 'Services/ReduxPersistConfig';
import {persistReducer} from 'redux-persist';

const middleware = [
    thunk,
    restApiMiddleware,
    socketApiMiddleware,
    timeInjectorMiddleware,
    createEpicMiddleware(rootEpic),
];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    persistReducer(persistConfig, reducers),
    composeEnhancer(applyMiddleware(...middleware))
);

export default store;