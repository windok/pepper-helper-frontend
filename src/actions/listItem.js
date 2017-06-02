import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';

export const fetchItemsForList = (listId) => (dispatch) => {

    if (listId == 0 || listId == '0') {
        return;
    }

    dispatch({
        type: actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
        listId
    });

    // todo iteration if total count is large or make lazy loading
    RestClient.get('/list-item', {params: {listId, limit: 1500}})
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