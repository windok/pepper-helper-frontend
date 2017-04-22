import {combineReducers} from 'redux';

import productStorage from './reducers/storage';
import uiCollection from './reducers/ui';

const productApp = combineReducers({
    productStorage,
    all: uiCollection()
});

export default productApp;