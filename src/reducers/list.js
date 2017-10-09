import * as actionType from 'Actions';
import {List, ListNullObject} from 'Models/List';
import {getUser} from 'Reducers/user';

const initialState = {
    items: new Map(),
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.FETCH_LIST_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

            case actionType.CREATE_LIST_REQUEST:
            case actionType.EDIT_LIST_REQUEST: {
                const id = action.payload.list.getId() || action.payload.list.getTmpId();

                return {
                    ...state,
                    items: new Map([...state.items]).set(id, action.payload.list.clone())
                };
            }

            case actionType.CREATE_LIST_SUCCESS:
            case actionType.EDIT_LIST_SUCCESS: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getTmpId());
                items.set(action.payload.getId(), action.payload.clone());

                return {...state, items};
            }

            case actionType.DELETE_LIST_REQUEST: {
                const items = new Map([...state.items]);
                items.delete(action.payload.list.getId());
                items.delete(action.payload.list.getTmpId());

                return {...state, items};
            }

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            items: Array.from(state.items.entries(), ([listId, list]) => [listId, list.serialize()])
        }),
        rehydrate: (persistedState) => ({
            items: new Map(persistedState.items.map(([listId, listData]) => [listId, new List(listData)]))
        })
    }
);


/**
 * @param state
 * @param id
 * @return {List}
 */
export const getList = (state, id) => {
    return state.list.items.get(id) || getListByTmpId(state, id) || new ListNullObject();
};

/**
 * @param state
 * @param tmpId
 * @return {List}
 */
export const getListByTmpId = (state, tmpId) => {
    return state.list.items.get(tmpId)
        || Array.from(state.list.items.values()).filter(list => list.getTmpId() === tmpId)[0]
        || new ListNullObject()
};

/**
 * @param state
 * @return {List}
 */
export const getFirstList = (state) => {
    const user = getUser(state);

    return (user && state.list.items.get(user.getDefaultProductListId()))
        || state.list.items.values().next().value
        || new ListNullObject();
};

/**
 * @param state
 * @return {Map}
 */
export const getListCollection = (state) => {
    return state.list.items;
};
