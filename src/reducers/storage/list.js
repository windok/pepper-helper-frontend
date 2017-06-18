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

        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            const itemIds = [];
            action.payload.forEach(listItem => itemIds.push(listItem.getId()));

            return {
                ...state,
                items: (new Map([...state.items])).set(action.meta.list.getId(), action.meta.list.setItems(itemIds))
            };

        case actionType.SAVE_ITEM_SUCCESS:
            const updatedList = state.items.get(action.payload.getListId()).pushItem(action.payload.getId());

            return {
                ...state,
                items: (new Map([...state.items])).set(updatedList.getId(), updatedList)
            };
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
