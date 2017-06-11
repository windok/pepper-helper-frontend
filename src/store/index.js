import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from './api-middleware';
import reducers from 'Reducers';

const configureStore = () => {
    const middleWares = [
        thunk,
        apiMiddleware
    ];

    return applyMiddleware(...middleWares)(createStore)(
        reducers,
        // {}, // todo initial state
        // todo add this options only in dev environment
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
};

export default configureStore();
