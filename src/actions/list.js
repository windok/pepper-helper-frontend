import * as actionType from 'Actions';
import {API_CALL, GET} from 'Store/api-middleware/RSAA';
import List from 'Models/List';


export const fetchAll = () => (dispatch) => {

    // todo iteration if total count is large
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
