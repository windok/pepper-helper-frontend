import {combineReducers} from 'redux';

import app from './app';
import auth from './auth';
import sync from './sync';
import ui from './ui';

import list from './list';
import listItem from './listItem';
import product from './product';
import group from './group';
import unit from './unit';
import user from './user';

export const transformers = {
    app,
    auth,
    sync,
    ui,

    list,
    listItem,
    product,
    group,
    unit,
    user,
};

export default combineReducers(transformers);
