import * as actionType from 'Actions';
import {List, ListNullObject} from 'Models/List';

export default (state = {items: new Map(), unsavedItems: new Map(), isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_LIST_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_LIST_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_LIST_COLLECTION_SUCCESS:
            return {...state, isFetching: false, items: new Map([...state.items, ...action.payload])};

        case actionType.CREATE_LIST_REQUEST:
        case actionType.EDIT_LIST_REQUEST:
            return {...state, unsavedItems: new Map(...state.unsavedItems).set(action.meta.list.getId(), action.meta.list.clone())};
        case actionType.CREATE_LIST_SUCCESS:
        case actionType.EDIT_LIST_SUCCESS: {
            const unsavedItems = new Map([...state.unsavedItems]);
            unsavedItems.delete(action.meta.list.getId());

            return {
                ...state,
                items: new Map([...state.items]).set(action.payload.getId(), action.payload.clone()),
                unsavedItems
            };
        }
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
    const listCollection = new Map();

    const populateListCollection = list => listCollection.set(list.getId(), list);

    state.storage.list.items.forEach(populateListCollection);
    state.storage.list.unsavedItems.forEach(populateListCollection);

    return listCollection;
};
