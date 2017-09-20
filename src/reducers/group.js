import * as actionType from 'Actions';
import {Group, GroupNullObject} from 'Models/Group';

const initialState = {
    items: new Map(),
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            // case actionType.FETCH_GROUP_COLLECTION_REQUEST:
            // case actionType.FETCH_GROUP_COLLECTION_ERROR:
            //     return {...state};
            case actionType.FETCH_GROUP_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

        }

        return state;
    },
    {
        persist: (state) => {
            return {
                items: Array.from(state.items.entries(), ([groupId, group]) => [groupId, group.serialize()])
            }
        },
        rehydrate: (persistedState) => {
            return {
                items: new Map(persistedState.items.map(([groupId, groupData]) => [groupId, new Group(groupData)]))
            }
        }
    }
);

/**
 * @param state
 * @return {Map}
 */
export const getGroupCollection = (state) => {
    return state.group.items;
};
