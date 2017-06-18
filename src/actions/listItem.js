import * as actionType from 'Actions';
import {API_CALL, GET, POST} from 'Store/api-middleware/RSAA';
import ListItem from 'Models/ListItem';


export const fetchItemsForList = (list) => (dispatch) => {

    if (list.isNullObject()) {
        return Promise.resolve();
    }

    // todo iteration if total count is large
    // todo custom redux middleware to fetch and process collections
    dispatch({
        [API_CALL]: {
            endpoint: '/list-item',
            method: GET,
            types: [
                actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
                {
                    type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                    payload: (action, state, response) => {
                        const listItemCollection = new Map();

                        (response.data.items || []).forEach(listItem => listItemCollection.set(
                            listItem.id, new ListItem({...listItem, productId: listItem.translationId}))
                        );

                        return listItemCollection;
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
        || product.getUserId() > 0
    ) {
        return Promise.resolve();
    }

    dispatch({
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
    const postData = listItem.serialize();
    postData.translationId = listItem.getProductId();

    const date = new Date();
    // 2017-06-03 20:55:26
    postData.date = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;


    dispatch({
        [API_CALL]: {
            endpoint: '/list-item',
            method: POST,
            types: [
                // todo create item in offline storage before request is sent
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
            params: postData,
        }
    });
};