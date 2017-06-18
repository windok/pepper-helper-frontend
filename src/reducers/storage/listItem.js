import * as actionType from 'Actions';
import {ListItem, ListItemNullObject} from 'Models/ListItem';

export default (state = {items: new Map(), template: null}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            return {...state, items: new Map([...state.items, ...action.payload])};

        case actionType.GET_ITEM_TEMPLATE_SUCCESS:
            return {...state, template: action.payload.clone()};

        case actionType.SAVE_ITEM_SUCCESS:
            return {
                items: new Map([...state.items]).set(action.payload.getId(), action.payload),
                template: null
            };
    }

    return state;
};

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getListItemCollectionForList = (state, productList) => {
    const itemCollection = new Map();

    productList.getItems().forEach(itemId => itemCollection.set(itemId, state.storage.listItem.items.get(itemId)));

    return itemCollection;
};

/**
 * @param state
 * @param {List} list
 * @param {Product} product
 * @return {ListItem}
 */
export const getListItem = (state, list, product) => {
    for (let [listItemId, listItem] of state.storage.listItem.items) {
        if (listItem.getListId() === list.getId() && listItem.getProductId() === product.getId()) {
            return listItem;
        }
    }

    return new ListItemNullObject();
};

/**
 * @param state
 * @param {List} list
 * @param {Product} product
 * @return {ListItem}
 */
export const getTemplate = (state, list, product) => {
    const template = state.storage.listItem.template;

    if (!template || template.getProductId() !== product.getId() || template.getListId() !== list.getId()) {
        return null;
    }

    return template;
};

