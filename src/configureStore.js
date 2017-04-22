import {createStore, combineReducers, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import productModule from './screens/products';
import demoActivityModule from './screens/demo-activities';

const configureStore = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    return createStore(
        combineReducers({
            product: productModule,
            activity: demoActivityModule
        }),
        // todo apply persisted state from local storage
        applyMiddleware(...middlewares)
    );
};

export default configureStore;
