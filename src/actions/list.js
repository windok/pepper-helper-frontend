import * as actionType from 'Actions';
import {API_CALL, GET, POST, PUT, DELETE} from 'Store/api-middleware/RSAA';
import {SOCKET_CALL} from 'Store/socket-middleware';
import List from 'Models/List';
import uuid from 'uuid/v4';

import store from 'Store';
import {getUser} from 'Reducers/user';

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
        type: actionType.CREATE_LIST_REQUEST,
        payload: {list},
        meta: {
            offline: {
                effect: {
                    action: 'product-list-create',
                    payload: {
                        ...list.serialize(),
                        // todo refactor setting auth token
                        PH_TOKEN: getUser(store.getState()).getToken()
                    },
                },
                commit: {
                    type: actionType.CREATE_LIST_SUCCESS,
                    payload: (listData) => new List({...listData, tmpId: listData.tmpId || ''})
                }
            }
        }
    });

    return Promise.resolve(list);
};

export const updateList = (list, newListName) => (dispatch) => {
    // todo update by tmpId
    // todo rollback if error happened
    const listUpdated = new List({...list.serialize(), name: newListName});

    dispatch({
        type: actionType.EDIT_LIST_REQUEST,
        payload: {list: listUpdated},
        meta: {
            offline: {
                effect: {
                    action: 'product-list-update',
                    payload: {
                        ...listUpdated.serialize(),
                        // todo refactor setting auth token
                        PH_TOKEN: getUser(store.getState()).getToken()
                    },
                },
                commit: {
                    type: actionType.EDIT_LIST_SUCCESS,
                    payload: (listData) => new List({...listData, tmpId: listData.tmpId || ''})
                }
            }
        }
    });
};

export const deleteList = (list) => (dispatch) => {
    // todo delete by tmpId
    // todo process rollback

    return dispatch({
        type: actionType.DELETE_LIST_REQUEST,
        payload: {list},
        meta: {
            offline: {
                effect: {
                    action: 'product-list-delete',
                    payload: {
                        id: list.getId(),
                        PH_TOKEN: getUser(store.getState()).getToken()
                    },
                }
            }
        }
    });
};
