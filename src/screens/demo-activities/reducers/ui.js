import {combineReducers} from 'redux';
import * as actionType from '../actions';

const uiCollection = () => {

    const ids = (state = [], action) => {
        switch (action.type) {
            case actionType.ADD_DEMO_ACTIVITY:
                return [
                    ...state,
                    action.activity.id
                ];
            default:
                return state;
        }
    };

    return combineReducers({
        ids
    });
};

export default uiCollection;