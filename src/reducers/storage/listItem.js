import * as actionType from 'Actions';
import {ListItem, CustomProductListItemTemplate} from 'Models/ListItem';

export default (state = {items: new Map(), template: null}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            return {...state, items: new Map([...state.items, ...action.payload])};

        case actionType.GET_ITEM_TEMPLATE_SUCCESS:
            return {...state, template: action.payload.clone()};

        case actionType.CREATE_ITEM_SUCCESS:
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
export const getTemplate = (state, list, product) => {
    if (!product.isCustom) {
        const template = state.storage.listItem.template;

        if (!template || template.getProductId() === product.getId() || template.getListId() === list.getId()) {
            return null;
        }

        return template;
    }

    let groupId = 0;
    let unitId = 0;

    for (let [key, value] of state.storage.group.items) {
        groupId = key;
        break;
    }

    for (let [key, value] of state.storage.unit.items) {
        unitId = key;
        break;
    }

    return new CustomProductListItemTemplate(list.getId(), product.getId(), groupId, unitId, 0);
};

