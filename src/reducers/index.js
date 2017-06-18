import {combineReducers} from 'redux';

import ui from './ui';

import list from './storage/list';
import listItem from './storage/listItem';
import product from './storage/product';
import unit from './storage/unit';
import group from './storage/group';
import user from './storage/user';

const storage = combineReducers({
    list,
    listItem,
    product,
    unit,
    group,
    user
});

export default combineReducers({
    storage,
    ui
});