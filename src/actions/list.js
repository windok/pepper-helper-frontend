import * as actionType from 'Actions';
import {API_CALL, GET, POST, PUT} from 'Store/api-middleware/RSAA';
import List from 'Models/List';


export const fetchAll = () => (dispatch) => {

    // todo iteration if total count is large
    // todo custom redux middleware to fetch and process collections
    dispatch({
        [API_CALL]: {
            endpoint: '/product-list',
            method: GET,
            types: [
                actionType.FETCH_LIST_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_LIST_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const listCollection = new Map();

                        (response.data.items || []).forEach(list => listCollection.set(list.id, new List(list)));

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
        return;
    }

    const list = new List({id: 0, name: listName});

    dispatch({
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

export const update = (oldList, newListName) => (dispatch) => {

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
