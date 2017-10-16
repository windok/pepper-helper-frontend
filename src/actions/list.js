import uuid from 'uuid/v4';

import * as actionType from 'Actions';

import {SOCKET_CALL} from 'Store/socket-middleware';
import List from 'Models/List';

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
                    payload: (action, state, response) => {
                        const listCollection = new Map();

                        (response.items || []).forEach(listData => listCollection.set(
                            listData.id,
                            new List({
                                ...listData,
                                tmpId: listData.tmpId || ''
                            })
                        ));

                        return listCollection;
                    }
                },
                actionType.FETCH_LIST_COLLECTION_ERROR
            ],
        }
    });
};

export const create = (listName) => (dispatch) => {
    if (listName.trim().length === 0) {
        return Promise.reject();
    }

    const list = new List({id: 0, tmpId: uuid(), name: listName});

    dispatch({
        type: actionType.CREATE_LIST_OFFLINE,
        payload: list,
        sync: {
            name: 'product-list-create',
            responseAction: actionType.CREATE_LIST_RESPONSE
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
            responseAction: actionType.EDIT_LIST_RESPONSE
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


const actionsToTrigger = {
    [actionType.CREATE_LIST_RESPONSE]: {success: actionType.CREATE_LIST_SUCCESS, error: actionType.CREATE_LIST_ERROR},
    [actionType.EDIT_LIST_RESPONSE]: {success: actionType.EDIT_LIST_SUCCESS, error: actionType.EDIT_LIST_ERROR},
    // todo delete success and error action triggering
    // [actionType.DELETE_LIST_RESPONSE]: {success: actionType.DELETE_LIST_SUCCESS, error: actionType.DELETE_LIST_ERROR},
};

export const listEpic = (action$, state) => action$
    .filter((action) => actionsToTrigger.hasOwnProperty(action.type))
    .map(action => {
        const response = action.payload;
        const nextActionType = actionsToTrigger[action.type];

        if (response.error) {
            return {type: nextActionType.error, payload: action.meta.syncAction.getPayload()}
        }

        return {
            type: nextActionType.success,
            payload: new List({...response, tmpId: response.tmpId || ''})
        }
    });