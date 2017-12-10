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

            case actionType.CREATE_GROUP_OFFLINE:
                return {
                    ...state,
                    items: (new Map([...state.items])).set(action.payload.getIdentifier(), action.payload.clone())
                };

            case actionType.CREATE_GROUP_SUCCESS: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getTmpId());
                items.set(action.payload.getIdentifier(), action.payload.clone());

                return {...state, items};
            }


            case actionType.USER_LOGOUT:
                return {...initialState}
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

/**
 * @param state
 * @param id
 * @return {Product}
 */
export const getGroup = (state, id) => {
    if (typeof id === 'string') {
        return id.includes('-') ? getGroupByTmpId(state, id) : getGrup(state, parseInt(id))
    }

    return state.group.items.get(id) || new GroupNullObject();
};

/**
 * @param state
 * @param tmpId
 * @return {Product}
 */
export const getGroupByTmpId = (state, tmpId) => {
    return state.group.items.get(tmpId)
        || Array.from(state.group.items.values()).filter(group => group.getTmpId() === tmpId)[0]
        || new GroupNullObject()
};

/**
 * @param state
 * @param name
 * @return {Product}
 */
export const getGroupByName = (state, name) => {
    return Array.from(state.group.items.values())
        .filter(group => group.getName() === name)[0] || new GroupNullObject();
};




/**
 * @param state
 * @return {Group}
 */
export const getFirst = (state) => {
    return state.group.items.values().next().value || new GroupNullObject();
};

