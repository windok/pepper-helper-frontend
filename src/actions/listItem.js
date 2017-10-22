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

addSyncCompleteHandler({
    match: ({response, syncAction}) => syncAction.getName() === 'list-item-create',
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
    // todo convert recommended item in general one in corresponding component
    listItem = new ListItem({...listItem.serialize(), date: Moment.utc(), type: TYPE_GENERAL});

    return dispatch({
        [API_CALL]: {
            endpoint: '/suspend-item/' + listItem.getIdentifier() + '/',
            method: PUT,
            types: [
                {
                    type: actionType.SUSPEND_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.SUSPEND_ITEM_SUCCESS,
                    meta: {listItem},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        date: response.data.date ? Moment.utc(response.data.date) : Moment.utc(),
                        productId: response.data.translationId
                    })
                },
                actionType.SUSPEND_ITEM_ERROR
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
    listItem = new ListItem({...listItem.serialize(), date: Moment.utc(), type: TYPE_GENERAL});

    return dispatch({
        [API_CALL]: {
            endpoint: '/list-item/' + listItem.getIdentifier(),
            method: PUT,
            types: [
                {
                    type: actionType.EDIT_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.EDIT_ITEM_SUCCESS,
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        tmpId: response.data.tmpId || '',
                        date: response.data.date ? Moment.utc(response.data.date) : Moment.utc(),
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
            endpoint: '/list-item/buy/' + listItem.getIdentifier(),
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
            endpoint: '/list-item/return/' + listItem.getIdentifier(),
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
