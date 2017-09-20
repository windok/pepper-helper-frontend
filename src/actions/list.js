import * as actionType from 'Actions';
import {API_CALL, GET, POST, PUT, DELETE} from 'Store/api-middleware/RSAA';
import List from 'Models/List';
import uuid from 'uuid/v4';


export const fetchAll = () => (dispatch) => {

    return dispatch({
        [API_CALL]: {
            endpoint: '/product-list',
            method: GET,
            types: [
                actionType.FETCH_LIST_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_LIST_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const listCollection = new Map();

                        (response.data.items || []).forEach(listData => {
                            listCollection.set(listData.id, new List({...listData, tmpId: listData.tmpId || ''}))
                        });

                        return listCollection;
                    }
                },
                actionType.FETCH_LIST_COLLECTION_ERROR
            ],
            params: {
                limit: 1000
            },
        }
    });
};

export const create = (listName) => (dispatch) => {
    if (listName.trim().length === 0) {
        return Promise.reject();
    }

    const list = new List({id: 0, tmpId: uuid(), name: listName});

    return dispatch({
        [API_CALL]: {
            endpoint: '/product-list',
            method: POST,
            types: [
                {
                    type: actionType.CREATE_LIST_REQUEST,
                    meta: {list}
                },
                {
                    type: actionType.CREATE_LIST_SUCCESS,
                    meta: {list},
                    payload: (action, state, response) => {
                        return new List(response.data);
                    }
                },
                actionType.CREATE_LIST_ERROR
            ],
            params: {...list.serialize()},
        }
    });
};

export const updateList = (oldList, newListName) => (dispatch) => {
    // todo update by tmpId
    if (oldList.isNullObject()) {
        return;
    }

    const list = new List({...oldList.serialize(), name: newListName});

    dispatch({
        [API_CALL]: {
            endpoint: '/product-list/' + list.getId(),
            method: PUT,
            types: [
                {
                    type: actionType.EDIT_LIST_REQUEST,
                    meta: {list}
                },
                {
                    type: actionType.EDIT_LIST_SUCCESS,
                    meta: {list},
                    payload: (action, state, response) => {
                        return new List(response.data);
                    }
                },
                actionType.EDIT_LIST_ERROR
            ],
            params: {...list.serialize()},
        }
    });
};

export const deleteList = (list) => (dispatch) => {

    if (list.isNullObject()) {
        return;
    }

    dispatch({
        [API_CALL]: {
            endpoint: '/product-list/' + list.getId(),
            method: DELETE,
            types: [
                {
                    type: actionType.DELETE_LIST_REQUEST,
                    meta: {list}
                },
                {
                    type: actionType.DELETE_LIST_SUCCESS,
                    meta: {list},
                },
                actionType.DELETE_LIST_ERROR
            ]
        }
    });
};
