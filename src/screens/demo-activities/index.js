import {combineReducers} from 'redux';

import activityStorage from './reducers/storage';
import uiCollection from './reducers/ui';

const activityApp = combineReducers({
    activityStorage,
    all: uiCollection()
});

export default activityApp;