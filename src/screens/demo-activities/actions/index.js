export const ADD_DEMO_ACTIVITY = 'ADD_DEMO_ACTIVITY';
export const DELETE_DEMO_ACTIVITY = 'DELETE_DEMO_ACTIVITY';
export const UPDATE_DEMO_ACTIVITY = 'UPDATE_DEMO_ACTIVITY';

// todo generate somehow another activity id
let activityId = 0;
export const addNewActivity = (name) => {
    return {
        type: ADD_DEMO_ACTIVITY,
        activity: {
            id: activityId++,
            name: name,
            state: 'pending'
        }
    }
};


export const updateActivity = (activityId, newName) => {
    return {
        type: UPDATE_DEMO_ACTIVITY,
        activityId,
        newName
    }
};