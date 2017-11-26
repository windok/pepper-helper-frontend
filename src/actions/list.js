import uuid from 'uuid/v4';

import * as actionType from 'Actions';

import {SOCKET_CALL} from 'Store/socket-middleware';
import List from 'Models/List';

import {addSyncCompleteHandler} from 'Actions/sync';
import RestClient from 'Services/RestClient';

export const selectProductList = (list) => ({
    type: actionType.SELECT_LIST,
    payload: list
});

const buildListCollectionFromResponse = (state, lists = []) => {
    const listCollection = new Map();

    lists.forEach(listData => listCollection.set(
        listData.id,
        new List({
            ...listData,
            tmpId: listData.tmpId || '',
            color: listData.color || ''
        })
    ));

    return listCollection;
};

export const fetchAll = () => (dispatch) => {
    return dispatch({
        [SOCKET_CALL]: {
            action: 'product-list-load',
            payload: {
                limit: 1000
            },
            types: [
                actionType.FETCH_LIST_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_LIST_COLLECTION_SUCCESS,
                    payload: (action, state, response) => buildListCollectionFromResponse(state, response.items)
                },
                actionType.FETCH_LIST_COLLECTION_ERROR
            ],
        }
    });
};

export const fetchListDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => action.payload.data.productLists.items)
    .filter(lists => lists.length)
    .map(lists => ({
        type: actionType.FETCH_LIST_COLLECTION_SUCCESS,
        payload: buildListCollectionFromResponse(store.getState(), lists),
    }));


export const create = (listName) => (dispatch) => {
    if (listName.trim().length === 0) {
        return Promise.reject();
    }

    const list = new List({id: 0, tmpId: uuid(), name: listName, color: ''});

    dispatch({
        type: actionType.CREATE_LIST_OFFLINE,
        payload: list,
        sync: {
            name: 'product-list-create',
            successAction: actionType.CREATE_LIST_SUCCESS,
            errorAction: actionType.CREATE_LIST_ERROR
        }
    });

    return list;
};

export const updateList = (list, newListName) => (dispatch) => {
    const listUpdated = new List({...list.serialize(), name: newListName});

    dispatch({
        type: actionType.EDIT_LIST_OFFLINE,
        payload: listUpdated,
        sync: {
            name: 'product-list-update',
            successAction: actionType.EDIT_LIST_SUCCESS,
            errorAction: actionType.EDIT_LIST_ERROR
        }
    });

    return listUpdated;
};

export const deleteList = (list) => (dispatch) => {
    dispatch({
        type: actionType.DELETE_LIST_OFFLINE,
        payload: list,
        sync: {
            name: 'product-list-delete',
        }
    });
};

addSyncCompleteHandler({
    match: ({response, syncAction}) => ['product-list-create', 'product-list-update'].includes(syncAction.getName()),
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction(),
        meta: syncAction.getMeta(),
        payload: new List({
            ...response,
            tmpId: response.tmpId || '',
            color: ''
        })
    }),
});


export const share = (list, user, email) => {
    return RestClient.put(
        'product-list/share/' + list.getId(),
        {email},
        {
            headers: {
                'PH-TOKEN': user.getToken()
            }
        }
    );
};