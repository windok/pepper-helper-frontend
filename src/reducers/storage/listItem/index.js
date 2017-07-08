import * as actionType from 'Actions';
import {
    ListItem,
    ListItemNullObject,
    STATUS_DRAFT,
    STATUS_BOUGHT,
    STATUS_SUSPENDED,
    TYPE_GENERAL,
    TYPE_RECOMMENDED
} from 'Models/ListItem';

const initialState = {
    items: new Map(),
    unsavedItems: new Map(),
    template: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            return {
                ...state,
                items: new Map([...state.items, ...action.payload]),
            };

        case actionType.GET_ITEM_TEMPLATE_SUCCESS:
            return {
                ...state,
                template: action.payload.clone()
            };

        case actionType.CREATE_ITEM_REQUEST:
            return {
                ...state,
                unsavedItems: new Map([...state.unsavedItems]).set(action.meta.listItem.getId(), action.meta.listItem.clone()),
                template: null
            };

        case actionType.CREATE_ITEM_SUCCESS: {
            const unsavedItems = new Map([...state.unsavedItems]);
            unsavedItems.delete(action.meta.listItem.getId());

            return {
                ...state,
                items: new Map([...state.items]).set(action.payload.getId(), action.payload.clone()),
                unsavedItems,
                template: null
            };
        }

        case actionType.EDIT_ITEM_REQUEST:
        case actionType.BUY_ITEM_REQUEST:
        case actionType.RETURN_ITEM_REQUEST:
            return {
                ...state,
                items: new Map([...state.items]).set(action.meta.listItem.getId(), action.meta.listItem.clone()),
            };
    }

    return state;
};

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getGeneralListItemsToDisplay = (state, productList) => {
    const itemCollection = new Map();

    if (productList.isNullObject()) {
        return itemCollection;
    }

    const addItemToCollection = listItem => {
        if (listItem.getListId() !== productList.getId() || listItem.getType() !== TYPE_GENERAL) {
            return;
        }

        itemCollection.set(listItem.getId(), listItem);
    };

    state.storage.listItem.items.forEach(addItemToCollection);
    state.storage.listItem.unsavedItems.forEach(addItemToCollection);

    return itemCollection;
};

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getRecommendedListItems = (state, productList) => {
    const itemCollection = new Map();

    state.storage.listItem.items.forEach(listItem => {
        if (
            listItem.getListId() !== productList.getId()
            || listItem.getType() !== TYPE_RECOMMENDED
        ) {
            return;
        }

        itemCollection.set(listItem.getId(), listItem);
    });

    return itemCollection;
};

/**
 * @param state
 * @param {number} itemId
 * @return {ListItem}
 */
export const getListItem = (state, itemId) => {
    return state.storage.listItem.items.get(itemId) || new ListItemNullObject();
};

/**
 * @param state
 * @param {List} list
 * @param {Product} product
 * @return {ListItem}
 */
export const getListItemByListAndProduct = (state, list, product) => {
    for (let listItem of state.storage.listItem.items.values()) {
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