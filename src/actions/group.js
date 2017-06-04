import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';
import Store from 'Store';


export const fetchAll = () => (dispatch) => {
    dispatch({
        type: actionType.FETCH_GROUP_COLLECTION_REQUEST
    });

    // todo iteration if total count is large
    RestClient.get('/translation', {params: {limit: 1000, type: 'group'}})
        .then((result) => {

            // todo process group in reducer, or consider to immutable js or create objects with type  Group
            const items = (result.data.items || []).map((groupTranslation) => {
                return {
                    id: groupTranslation.id,
                    name: groupTranslation[Store.getState().storage.user.language] || groupTranslation.en
                }
            });

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
