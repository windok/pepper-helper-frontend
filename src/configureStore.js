import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const configureStore = () => {
    const middleWares = [
        thunk
    ];

    return applyMiddleware(...middleWares)(createStore)(
        reducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
};

export default configureStore;
