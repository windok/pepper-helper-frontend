import {combineReducers} from 'redux';

import list from './storage/list';
import listItem from './storage/listItem';
import translation from './storage/translation';
import unit from './storage/unit';
import category from './storage/category';
import group from './storage/group';
import user from './storage/user';

const storage = combineReducers({
    list,
    listItem,
    translation,
    unit,
    category,
    group,
    user
});

export default combineReducers({
    storage
});