import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';


export const fetchAll = () => (dispatch) => {
    dispatch({
        type: actionType.FETCH_TRANSLATION_COLLECTION_REQUEST
    });

    // todo iteration if total count is large
    RestClient.get('/translation', {params: {limit: 1000}})
        .then((result) => {
            const items = result.data.items || [];

            dispatch({
                type: actionType.FETCH_TRANSLATION_COLLECTION_SUCCESS,
                items
            });
        }, (error) => {
            dispatch({
                type: actionType.FETCH_TRANSLATION_COLLECTION_ERROR,
                error
            });

        });
};

export const searchProductTranslation = (query) => (dispatch) => {
    if (query.length < 3) {
        return;
    }

    dispatch({
        type: actionType.SEARCH_TRANSLATION_REQUEST
    });

    RestClient.get('/translation/search', {params: {value: query, type: 'product', limit: 50}})
        .then((result) => {
            const items = result.data.items || [];

            dispatch({
                type: actionType.SEARCH_TRANSLATION_SUCCESS,
                query,
                items
            });
        }, (error) => {
            dispatch({
                type: actionType.SEARCH_TRANSLATION_ERROR,
                query,
                error
            });

        });
};
