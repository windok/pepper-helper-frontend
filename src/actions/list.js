import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';


export const fetchAll = () => (dispatch) => {
    dispatch({
        type: actionType.FETCH_LIST_COLLECTION_REQUEST
    });

    // todo iteration if total count is large
    RestClient.get('/product-list', {params: {limit: 1000}})
        .then((result) => {
            const listCollection = result.data.items || [];

            dispatch({
                type: actionType.FETCH_LIST_COLLECTION_SUCCESS,
                listCollection
            });
        }, (error) => {
            dispatch({
                type: actionType.FETCH_LIST_COLLECTION_ERROR,
                error
            });

        });
};
