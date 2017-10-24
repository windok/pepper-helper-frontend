import uuid from 'uuid/v4';
import Moment from 'moment';

import * as actionType from 'Actions';

import Store from 'Store';
import {API_CALL, GET, POST, PUT} from 'Store/api-middleware/RSAA';
import {SOCKET_CALL} from 'Store/socket-middleware';

import {
    ListItem, CustomProductListItemTemplate,
    STATUS_DRAFT, STATUS_BOUGHT,
    TYPE_GENERAL, TYPE_RECOMMENDED
} from 'Models/ListItem';


import {getFirst as getFirstGroup} from 'Reducers/group';
import {getFirst as getFirstUnit} from 'Reducers/unit';
import {getUserLanguage} from 'Reducers/user';

import {addSyncCompleteHandler} from 'Actions/sync';

export const fetchItemsForList = (list) => (dispatch) => {

    if (list.isNullObject() || list.getId() === list.getTmpId()) {
        return Promise.resolve();
    }

    return dispatch({
        [SOCKET_CALL]: {
            action: 'list-item-load',
            payload: {
                listId: list.getIdentifier(),
                limit: 1000
            },
            types: [
                actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
                {
                    type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                    payload: (action, state, response) => {
                        const items = new Map();

                        (response.items || []).forEach(listItemData => {
                            const listItem = new ListItem({
                                ...listItemData,
                                tmpId: listItemData.tmpId || '',
                                productId: listItemData.translationId
                            });

                            return items.set(listItem.getIdentifier(), listItem);
                        });

                        return items;
                    },
                    meta: {list}
                },
                actionType.FETCH_ITEMS_FOR_LIST_ERROR
            ],
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
        dispatch({
            type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
            meta: {list, product},
            payload: new CustomProductListItemTemplate(
                '',
                list.getIdentifier(),
                product.getIdentifier(),
                getFirstGroup(Store.getState()).getIdentifier(),
                getFirstUnit(Store.getState()).getIdentifier(),
                1
            )
        });

        return Promise.resolve();
    }

    return dispatch({
        [SOCKET_CALL]: {
            action: 'list-item-getTemplate',
            payload: {
                translationId: product.getId(),
                language: getUserLanguage(Store.getState()),
                listId: list.getId(),
            },
            types: [
                actionType.GET_ITEM_TEMPLATE_REQUEST,
                {
                    type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                    meta: {list, product},
                    payload: (action, state, response) => new ListItem({
                        ...response,
                        id: response.id || 0,
                        tmpId: response.tmpId || '',
                        date: response.date ? Moment.utc(response.date) : Moment.utc(),
                        productId: response.translationId,
                        quantity: parseInt(response.quantity) || 1
                    })
                },
                actionType.GET_ITEM_TEMPLATE_ERROR
            ]
        }
    });
};

export const createItem = (listItem) => (dispatch) => {
    listItem = new ListItem({...listItem.serialize(), date: Moment.utc()});

    dispatch({
        type: actionType.CREATE_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-create',
            payload: (state) => ({
                ...listItem.serialize(),
                language: getUserLanguage(state),
                translationId: listItem.getProductId(),
            }),
            successAction: actionType.CREATE_ITEM_SUCCESS,
            errorAction: actionType.CREATE_ITEM_ERROR
        }
    });

    return listItem;
};

export const editItem = (listItem) => (dispatch) => {
    listItem = new ListItem({...listItem.serialize(), date: Moment.utc()});

    dispatch({
        type: actionType.EDIT_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-update',
            payload: (state) => ({
                ...listItem.serialize(),
                language: getUserLanguage(state),
                translationId: listItem.getProductId(),
            }),
            successAction: actionType.EDIT_ITEM_SUCCESS,
            errorAction: actionType.EDIT_ITEM_ERROR
        }
    });

    return listItem;
};

export const deleteItem = (listItem) => (dispatch) => {
    dispatch({
        type: actionType.DELETE_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-delete',
            payload: {
                id: listItem.getId()
            },
            successAction: actionType.DELETE_ITEM_SUCCESS,
            errorAction: actionType.DELETE_ITEM_ERROR
        }
    });
};

addSyncCompleteHandler({
    match: ({response, syncAction}) => ['list-item-create', 'list-item-update'].includes(syncAction.getName()),
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction(),
        meta: syncAction.getMeta(),
        payload: new ListItem({
            ...response,
            tmpId: response.tmpId || '',
            date: response.date ? Moment.utc(response.date) : Moment.utc(),
            productId: response.translationId
        })
    }),
});

export const suspendItem = (listItem, date) => (dispatch) => {
    listItem = new ListItem({...listItem.serialize(), date: Moment.utc(), status: STATUS_BOUGHT});

    dispatch({
        type: actionType.SUSPEND_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-suspend',
            successAction: actionType.SUSPEND_ITEM_SUCCESS,
            errorAction: actionType.SUSPEND_ITEM_ERROR
        }
    });

    return listItem;
};

/**
 * @param {ListItem} listItem
 */
export const buyItem = (listItem) => (dispatch) => {
    if (listItem.getStatus() !== STATUS_DRAFT && listItem.getType() !== TYPE_GENERAL) {
        return Promise.reject();
    }

    listItem = new ListItem({...listItem.serialize(), status: STATUS_BOUGHT});

    dispatch({
        type: actionType.BUY_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-buy',
            successAction: actionType.BUY_ITEM_SUCCESS,
            errorAction: actionType.BUY_ITEM_ERROR
        }
    });

    return listItem;
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
        type: actionType.RETURN_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-return',
            successAction: actionType.RETURN_ITEM_SUCCESS,
            errorAction: actionType.RETURN_ITEM_ERROR
        }
    });
};

addSyncCompleteHandler({
    match: ({response, syncAction}) => ['list-item-buy', 'list-item-return', 'list-item-suspend'].includes(syncAction.getName()),
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction()
    }),
});

