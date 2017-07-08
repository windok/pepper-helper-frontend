import * as actionType from 'Actions';
import {API_CALL, GET, POST, PUT} from 'Store/api-middleware/RSAA';

import {ListItem, CustomProductListItemTemplate,
    STATUS_DRAFT, STATUS_BOUGHT, STATUS_SUSPENDED,
    TYPE_GENERAL, TYPE_RECOMMENDED} from 'Models/ListItem';

import Store from 'Store';

export const fetchItemsForList = (list) => (dispatch) => {

    if (list.isNullObject()) {
        return Promise.resolve();
    }

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item',
            method: GET,
            types: [
                actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
                {
                    type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                    payload: (action, state, response) => {
                        const items = new Map();

                        (response.data.items || []).forEach(listItemData => {
                            const listItem = new ListItem({
                                ...listItemData, productId: listItemData.translationId
                            });

                            return items.set(listItem.getId(), listItem);
                        });

                        return items;
                    },
                    meta: {list}
                },
                actionType.FETCH_ITEMS_FOR_LIST_ERROR
            ],
            params: {
                listId: list.getId(),
                limit: 1000
            },
        }
    });
};

export const getTemplate = (list, product) => (dispatch) => {
    if (
        !list || !product
        || list.isNullObject() || product.isNullObject()
    ) {
        return Promise.resolve();
    }

    if (product.isCustom()) {
        let groupId = Store.getState().storage.group.items.keys().next().value || 0;
        let unitId = Store.getState().storage.unit.items.keys().next().value || 0;

        dispatch({
            type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
            meta: {list, product},
            payload: new CustomProductListItemTemplate(list.getId(), product.getId(), groupId, unitId, 0)
        });

        return Promise.resolve();
    }

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item-template/' + product.getId() + '/' + list.getId(),
            method: GET,
            types: [
                actionType.GET_ITEM_TEMPLATE_REQUEST,
                {
                    type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                    meta: {list, product},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        id: response.data.id || 0,
                        date: response.data.date || new Date(),
                        productId: response.data.translationId
                    })
                },
                actionType.GET_ITEM_TEMPLATE_ERROR
            ]
        }
    });
};

export const createItem = (listItem) => (dispatch) => {
    listItem = new ListItem({...listItem.serialize(), date: new Date()});

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item',
            method: POST,
            types: [
                {
                    type: actionType.CREATE_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.CREATE_ITEM_SUCCESS,
                    meta: {listItem},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        date: response.data.date || new Date(),
                        productId: response.data.translationId
                    })
                },
                actionType.CREATE_ITEM_ERROR
            ],
            params: {
                ...listItem.serialize(),
                translationId: listItem.getProductId()
            },
        }
    });
};

export const editItem = (listItem) => (dispatch) => {
    // todo convert recommended item in general one in corresponding component
    listItem = new ListItem({...listItem.serialize(), date: new Date(), type: TYPE_GENERAL});

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item/' + listItem.getId(),
            method: PUT,
            types: [
                {
                    type: actionType.EDIT_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.EDIT_ITEM_SUCCESS,
                    meta: {listItem},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        date: response.data.date || new Date(),
                        productId: response.data.translationId
                    })
                },
                actionType.EDIT_ITEM_ERROR
            ],
            params: {
                ...listItem.serialize(),
                translationId: listItem.getProductId()
            },
        }
    });
};

/**
 * @param {ListItem} listItem
 */
export const buyItem = (listItem) => (dispatch) => {
    if (listItem.getStatus() !== STATUS_DRAFT && listItem.getType() !== TYPE_GENERAL) {
        return Promise.reject();
    }

    listItem = new ListItem({...listItem.serialize(), status: STATUS_BOUGHT});

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item/buy/' + listItem.getId(),
            method: PUT,
            types: [
                {
                    type: actionType.BUY_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.BUY_ITEM_SUCCESS,
                    meta: {listItem},
                },
                actionType.BUY_ITEM_ERROR
            ],
        }
    });
};

/**
 * @param {ListItem} listItem
 */
export const returnItem = (listItem) => (dispatch) => {
    if (listItem.getStatus() !== STATUS_BOUGHT && listItem.getType() !== TYPE_GENERAL) {
        return Promise.reject();
    }

    listItem = new ListItem({...listItem.serialize(), status: STATUS_DRAFT});

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item/return/' + listItem.getId(),
            method: PUT,
            types: [
                {
                    type: actionType.RETURN_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.RETURN_ITEM_SUCCESS,
                    meta: {listItem},
                },
                actionType.RETURN_ITEM_ERROR
            ],
        }
    });
};
