import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';
import {API_CALL, GET} from 'Store/api-middleware/RSAA';
import ListItem from 'Models/ListItem';


export const fetchItemsForList = (list) => (dispatch) => {

    if (list.isNullObject()) {
        return Promise.resolve();
    }

    // todo iteration if total count is large
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

export const getTemplate = (list, translation) => (dispatch) => {
    if (!list || !translation || translation.userId > 0) {
        return Promise.resolve();
    }

    dispatch({
        type: actionType.GET_ITEM_TEMPLATE_REQUEST,
        listId: list.getId(),
        translationId: translation.id,

    });

    return RestClient.get('/list-item-template/' + translation.id + '/' + list.getId())
        .then((result) => {
            const template = result.data;

            dispatch({
                type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                listId: list.getId(),
                translationId: translation.id,
                template
            });

            return template;
        }, (error) => {
            dispatch({
                type: actionType.GET_ITEM_TEMPLATE_ERROR,
                listId: list.getId(),
                translationId: translation.id,
                error
            });

            return error;
        });
};

export const createItem = (template) => (dispatch) => {
    dispatch({
        type: actionType.CREATE_ITEM_REQUEST,
        template
    });

    return RestClient.post('/list-item', template)
        .then((result) => {
            const listItem = result.data;

            dispatch({
                type: actionType.CREATE_ITEM_SUCCESS,
                template,
                listItem,
            });

            return listItem;
        }, (error) => {
            dispatch({
                type: actionType.CREATE_ITEM_ERROR,
                template,
                error
            });

            return error;
        });
};