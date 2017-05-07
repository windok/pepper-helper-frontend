import {combineReducers} from 'redux';

import productStorage from './products/storage';
import uiCollection from './products/ui';

const productApp = combineReducers({
    productStorage,
    all: uiCollection()
});

export default combineReducers({
   productApp
});