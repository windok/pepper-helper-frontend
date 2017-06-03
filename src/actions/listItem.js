import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';

export const fetchItemsForList = (listId) => (dispatch) => {

    if (listId == 0 || listId == '0') {
        return Promise.resolve();
    }

    dispatch({
        type: actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
        listId
    });

    // todo iteration if total count is large or make lazy loading
    return RestClient.get('/list-item', {params: {listId, limit: 1500}})
        .then((result) => {
            const listItems = result.data.items || [];

            dispatch({
                type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                listId,
                listItems
            });

        }, (error) => {
            dispatch({
                type: actionType.FETCH_ITEMS_FOR_LIST_ERROR,
                listId,
                error
            });

        });
};

export const getTemplate = (listId, translationId) => (dispatch) => {
    if (!listId || !translationId || listId === '0' || translationId === '0') {
        return Promise.resolve();
    }

    dispatch({
        type: actionType.GET_ITEM_TEMPLATE_REQUEST,
        listId
    });

    return RestClient.get(`/list-item-template/${translationId}/${listId}`)
        .then((result) => {
            dispatch({
                type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                translationId,
                listId,
                template: result.data
            });

        }, (error) => {
            dispatch({
                type: actionType.GET_ITEM_TEMPLATE_ERROR,
                translationId,
                listId,
                error
            });

        });
};

export const createItem = (template) => (dispatch) => {
    dispatch({
        type: actionType.CREATE_ITEM_REQUEST,
        template
    });

    return RestClient.post('/list-item', template)
        .then((result) => {
            dispatch({
                type: actionType.CREATE_ITEM_SUCCESS,
                template,
                listItem: result.data,
            });

        }, (error) => {
            dispatch({
                type: actionType.CREATE_ITEM_ERROR,
                template,
                error
            });

        });
};