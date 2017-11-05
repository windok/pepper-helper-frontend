import * as actionType from 'Actions';
import {List, ListNullObject} from 'Models/List';

const initialState = {
    items: new Map(),
    selected: null
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.FETCH_LIST_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

            case actionType.CREATE_LIST_OFFLINE:
            case actionType.EDIT_LIST_OFFLINE:
                return {
                    ...state,
                    items: new Map([...state.items]).set(action.payload.getIdentifier(), action.payload.clone())
                };

            case actionType.DELETE_LIST_OFFLINE: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getId());
                items.delete(action.payload.getTmpId());

                return {...state, items};
            }

            case actionType.CREATE_LIST_SUCCESS:
            case actionType.EDIT_LIST_SUCCESS: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getTmpId());
                items.set(action.payload.getIdentifier(), action.payload.clone());

                return {...state, items};
            }

            case actionType.SELECT_LIST:
                if (!state.items.has(action.payload.getIdentifier())) {
                    return state;
                }

                return {...state, selected: action.payload.getIdentifier()};

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            items: Array.from(state.items.entries(), ([listId, list]) => [listId, list.serialize()]),
            selected: state.selected
        }),
        rehydrate: (persistedState) => ({
            items: new Map(persistedState.items.map(([listId, listData]) => [listId, new List(listData)])),
            selected: persistedState.selected
        })
    }
);


/**
 * @param state
 * @param id
 * @return {List}
 */
export const getList = (state, id) => {
    if (typeof id === 'string') {
        return id.includes('-') ? getListByTmpId(state, id) : getList(state, parseInt(id))
    }

    return state.list.items.get(id) || new ListNullObject();
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
export const getSelectedList = (state) => state.list.items.get(state.list.selected) || null;

/**
 * @param state
 * @return {List}
 */
export const getFirstList = (state) => state.list.items.values().next().value || null;

/**
 * @param state
 * @return {Map}
 */
export const getListCollection = (state) => state.list.items;
