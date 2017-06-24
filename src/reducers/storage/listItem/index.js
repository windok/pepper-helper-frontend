import * as actionType from 'Actions';
import {ListItem, ListItemNullObject, STATUS_DRAFT, STATUS_BOUGHT, STATUS_SUSPENDED} from 'Models/ListItem';

import general from './general';
import recommended from './recommended';
import {combineReducers} from 'redux';

export default combineReducers({
    general,
    recommended
});

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getDraftListItems = (state, productList) => {
    return getGeneralListItemsByStatus(state, productList, STATUS_DRAFT);
};

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getBoughtListItems = (state, productList) => {
    return getGeneralListItemsByStatus(state, productList, STATUS_BOUGHT);
};

/**
 * @param state
 * @param {List} productList
 * @param {string} status
 * @return {Map}
 */
export const getGeneralListItemsByStatus = (state, productList, status) => {
    const itemCollection = new Map();

    state.storage.listItem.general.items.forEach(listItem => {
        if (listItem.getListId() !== productList.getId() || listItem.getStatus() !== status) {
            return;
        }

        itemCollection.set(listItem.getId(), listItem);
    });

    return itemCollection;
};


/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getRecommendedListItems = (state, productList) => {
    const itemCollection = new Map();

    state.storage.listItem.recommended.items.forEach(listItem => {
        if (listItem.getListId() !== productList.getId()) {
            return;
        }

        itemCollection.set(listItem.getId(), listItem);
    });

    return itemCollection;
};

/**
 * @param state
 * @param {List} list
 * @param {Product} product
 * @return {ListItem}
 */
export const getListItem = (state, list, product) => {
    for (let [listItemId, listItem] of state.storage.listItem.general.items) {
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
    const template = state.storage.listItem.general.template;

    if (!template || template.getProductId() !== product.getId() || template.getListId() !== list.getId()) {
        return null;
    }

    return template;
};