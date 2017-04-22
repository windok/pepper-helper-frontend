import * as actionType from '../actions';

function activityStorage(state = {}, action) {
    switch (action.type) {
        case actionType.ADD_DEMO_ACTIVITY: {
            const newState = {...state};
            const newActivity = {...action.activity};

            newState[newActivity.id] = newActivity;

            return newState;
        }
        case actionType.UPDATE_DEMO_ACTIVITY: {
            const newState = {...state};

            newState[action.activityId] = {...state[action.activityId], ...{name: action.newName}};

            return newState;
        }
        default:
            return state;
    }
}

export default activityStorage;