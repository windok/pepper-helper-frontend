import * as actionType from 'Actions';
import {
    ListItem,
    ListItemNullObject,
    TYPE_GENERAL,
    TYPE_RECOMMENDED
} from 'Models/ListItem';

const initialState = {
    items: new Map(),
    template: null,
};

export default Object.assign(
    (state = initialState, action) => {
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
                    items: new Map([...state.items]).set(action.meta.listItem.getTmpId(), action.meta.listItem.clone()),
                    template: null
                };

            case actionType.CREATE_ITEM_SUCCESS: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getTmpId());
                items.set(action.payload.getId(), action.payload.clone());

                return {
                    ...state,
                    items,
                    template: null
                };
            }

            case actionType.EDIT_ITEM_REQUEST:
            case actionType.SUSPEND_ITEM_REQUEST:
            case actionType.BUY_ITEM_REQUEST:
            case actionType.RETURN_ITEM_REQUEST:
                return {
                    ...state,
                    items: new Map([...state.items]).set(action.meta.listItem.getId(), action.meta.listItem.clone()),
                };

            case actionType.EDIT_ITEM_SUCCESS:
                return {
                    ...state,
                    items: new Map([...state.items]).set(action.payload.getId(), action.payload.clone()),
                };

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            items: Array.from(state.items.entries(), ([itemId, listItem]) => [itemId, listItem.serialize()])
        }),
        rehydrate: (persistedState) => ({
            items: new Map(persistedState.items.map(([itemId, listItemData]) => [itemId, new ListItem(listItemData)]))
        })
    }
);

/**
 * @param state
 * @param {List} productList
 * @return {Map}
 */
export const getGroupedItemForList = (state, productList) => {
    // todo make prepared grouped item via reducer

    const itemCollection = new Map();

    if (productList.isNullObject()) {
        return itemCollection;
    }

    state.listItem.items.forEach(listItem => {
        if (listItem.getListId() !== productList.getId()) {
            return;
        }

        itemCollection.has(listItem.getGroupId()) || itemCollection.set(listItem.getGroupId(), new Map());

        itemCollection.get(listItem.getGroupId()).set(listItem.getId(), listItem);
    });

    return itemCollection;
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

    state.listItem.items.forEach(listItem => {
        if (listItem.getListId() !== productList.getId() || listItem.getType() !== TYPE_GENERAL) {
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

    state.listItem.items.forEach(listItem => {
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
    return state.listItem.items.get(itemId) || new ListItemNullObject();
};

/**
 * @param state
 * @param {List} list
 * @param {Product} product
 * @return {ListItem}
 */
export const getListItemByListAndProduct = (state, list, product) => {
    for (let listItem of state.listItem.items.values()) {
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
    const template = state.listItem.template;

    if (!template || template.getProductId() !== product.getId() || template.getListId() !== list.getId()) {
        return null;
    }

    return template;
};