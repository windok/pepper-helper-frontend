import {combineReducers} from 'redux';

import list from './storage/list';
import listItem from './storage/listItem';

const storage = combineReducers({
    list,
    listItem
});

export default combineReducers({
    storage
});