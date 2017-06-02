import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';


export const fetchAll = () => (dispatch) => {
    dispatch({
        type: actionType.FETCH_GROUP_COLLECTION_REQUEST
    });

    // todo iteration if total count is large
    RestClient.get('/group', {params: {limit: 1000}})
        .then((result) => {
            const items = result.data.items || [];

            dispatch({
                type: actionType.FETCH_GROUP_COLLECTION_SUCCESS,
                items
            });
        }, (error) => {
            dispatch({
                type: actionType.FETCH_GROUP_COLLECTION_ERROR,
                error
            });

        });
};
