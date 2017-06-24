import * as actionType from 'Actions';
import {List, ListNullObject} from 'Models/List';

export default (state = {items: new Map(), isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_LIST_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_LIST_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_LIST_COLLECTION_SUCCESS:
            return {isFetching: false, items: new Map([...state.items, ...action.payload])};
    }

    return state;
};


/**
 * @param state
 * @param id
 * @return {List}
 */
export const getList = (state, id) => {
    return state.storage.list.items.get(id) || new ListNullObject();
};

/**
 * @param state
 * @return {List}
 */
export const getFirstList = (state) => {
    for (let [listId, list] of state.storage.list.items) {
        return list;
    }

    return new ListNullObject();
};

/**
 * @param state
 * @return {Map}
 */
export const getListCollection = (state) => {
    return state.storage.list.items;
};
