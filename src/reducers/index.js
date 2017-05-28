import {combineReducers} from 'redux';

// import network from './network';


import list from './storage/list';
import listItem from './storage/listItem';

const storage = combineReducers({
    list,
    listItem
});

export default combineReducers({
    // network,
    storage
});