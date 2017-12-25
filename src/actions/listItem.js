import Moment from 'moment';
import uuid from 'uuid/v4';

import * as actionType from 'Actions';

import {SOCKET_CALL} from 'Store/socket-middleware';

import {
    ListItem, CustomProductListItemTemplate,
    STATUS_DRAFT, STATUS_BOUGHT,
    TYPE_GENERAL, TYPE_RECOMMENDED
} from 'Models/ListItem';


import {getFirst as getFirstGroup} from 'Reducers/group';
import {getFirstUserUnit} from 'Reducers/unit';
import {getUser} from 'Reducers/user';

import {addSyncCompleteHandler} from 'Actions/sync';

const buildListItemCollectionFromResponse = (state, listItems = []) => {
    const items = new Map();

    listItems.forEach(listItemData => {
        const listItem = new ListItem({
            ...listItemData,
            tmpId: listItemData.tmpId || '',
            productId: listItemData.translationId
        });

        return items.set(listItem.getIdentifier(), listItem);
    });

    return items;
};

export const fetchAll = () => ({
    [SOCKET_CALL]: {
        action: 'list-item-load',
        payload: {
            limit: 1000
        },
        types: [
            actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
            {
                type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                payload: (action, state, response) => buildListItemCollectionFromResponse(state, response.items),
            },
            actionType.FETCH_ITEMS_FOR_LIST_ERROR
        ],
    }
});

export const fetchListItemDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => action.payload.data.listItems.items)
    .filter(listItems => listItems.length)
    .map(listItems => ({
        type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
        payload: buildListItemCollectionFromResponse(store.getState(), listItems),
    }));


export const getTemplate = (list, product) => (dispatch, getState) => {
    if (
        !list || !product
        || list.isNullObject() || product.isNullObject()
    ) {
        return;
    }

    const state = getState();

    const createTemplateOffline = () => ({
        type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
        meta: {list, product},
        payload: new CustomProductListItemTemplate(
            uuid(),
            list.getIdentifier(),
            product.getIdentifier(),
            getFirstGroup(state).getIdentifier(),
            getFirstUserUnit(state).getIdentifier(),
            1
        )
    });

    if (product.isCustom()) {
        return dispatch(createTemplateOffline());
    }

    return dispatch({
        [SOCKET_CALL]: {
            action: 'list-item-getTemplate',
            payload: (state) => ({
                translationId: product.getId(),
                language: getUser(state).getLanguage(),
                listId: list.getId(),
            }),
            fallback: createTemplateOffline,
            types: [
                actionType.GET_ITEM_TEMPLATE_REQUEST,
                {
                    type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                    meta: {list, product},
                    payload: (action, state, response) => new ListItem({
                        ...response,
                        id: response.id || 0,
                        tmpId: uuid(),
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

export const createItem = (itemTemplate) => (dispatch) => {
    const listItem = new ListItem({...itemTemplate.serialize(), date: Moment.utc()});

    dispatch({
        type: actionType.CREATE_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-create',
            payload: (state) => ({
                ...listItem.serialize(),
                language: getUser(state).getLanguage(),
                translationId: listItem.getProductId(),
            }),
            successAction: actionType.CREATE_ITEM_SUCCESS,
            errorAction: actionType.CREATE_ITEM_ERROR
        }
    });

    return listItem;
};

export const editItem = (oldListItem) => (dispatch) => {
    const listItem = new ListItem({...oldListItem.serialize(), date: Moment.utc()});

    dispatch({
        type: actionType.EDIT_ITEM_OFFLINE,
        payload: listItem,
        sync: {
            name: 'list-item-update',
            payload: (state) => ({
                ...listItem.serialize(),
                language: getUser(state).getLanguage(),
                translationId: listItem.getProductId(),
            }),
            successAction: actionType.EDIT_ITEM_SUCCESS,
            errorAction: actionType.EDIT_ITEM_ERROR
        }
    });

    return listItem;
};

export const deleteItem = (listItem) => ({
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

/**
 * @param {ListItem} listItem
 */
export const buyItem = listItem => {
    if (listItem.getStatus() !== STATUS_DRAFT && listItem.getType() !== TYPE_GENERAL) {
        return;
    }

    return {
        type: actionType.BUY_ITEM_OFFLINE,
        payload: new ListItem({...listItem.serialize(), status: STATUS_BOUGHT}),
        sync: {
            name: 'list-item-buy',
            successAction: actionType.BUY_ITEM_SUCCESS,
            errorAction: actionType.BUY_ITEM_ERROR
        }
    };
};

/**
 * @param {ListItem} listItem
 */
export const returnItem = listItem => {
    if (listItem.getStatus() !== STATUS_BOUGHT && listItem.getType() !== TYPE_GENERAL) {
        return;
    }

    return {
        type: actionType.RETURN_ITEM_OFFLINE,
        payload: new ListItem({...listItem.serialize(), status: STATUS_DRAFT}),
        sync: {
            name: 'list-item-return',
            successAction: actionType.RETURN_ITEM_SUCCESS,
            errorAction: actionType.RETURN_ITEM_ERROR
        }
    };
};

export const suspendItem = (listItem, date) => {
    if (listItem.getStatus() !== STATUS_DRAFT) {
        return;
    }

    return {
        type: actionType.SUSPEND_ITEM_OFFLINE,
        payload: new ListItem({...listItem.serialize(), date}),
        sync: {
            name: 'list-item-suspend',
            payload: {
                id: listItem.getIdentifier(),
                date: date.format('YYYY-MM-DD HH:mm:ss')
            },
            successAction: actionType.SUSPEND_ITEM_SUCCESS,
            errorAction: actionType.SUSPEND_ITEM_ERROR
        }
    };
};

addSyncCompleteHandler({
    match: ({response, syncAction}) => ['list-item-buy', 'list-item-return', 'list-item-suspend'].includes(syncAction.getName()),
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction()
    }),
});

