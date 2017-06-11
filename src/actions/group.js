import * as actionType from 'Actions';
import {API_CALL, GET} from 'Store/api-middleware/RSAA';
import Group from 'Models/Group';

export const fetchAll = () => (dispatch) => {

    // todo iteration if total count is large
    // todo custom redux middleware to fetch and process collections
    dispatch({
        [API_CALL]: {
            endpoint: '/translation',
            method: GET,
            types: [
                actionType.FETCH_GROUP_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_GROUP_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const groupCollection = new Map();

                        (response.data.items || []).forEach(groupTranslation => groupCollection.set(
                            groupTranslation.id,
                            new Group({
                                id: groupTranslation.id,
                                name: groupTranslation[state.storage.user.language] || groupTranslation.en
                            })
                        ));

                        return groupCollection;
                    }
                },
                actionType.FETCH_GROUP_COLLECTION_ERROR
            ],
            params: {
                type: 'group',
                limit: 1000
            },
        }
    });
};
