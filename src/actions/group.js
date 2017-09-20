import * as actionType from 'Actions';
import {API_CALL, GET, POST} from 'Store/api-middleware/RSAA';
import Group from 'Models/Group';

export const fetchAll = () => (dispatch) => {

    return dispatch({
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
                                tmpId: groupTranslation.tmpId || '',
                                name: groupTranslation[state.user.language] || groupTranslation.en
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


export const createGroup = (value) => (dispatch) => {
    return dispatch({
        [API_CALL]: {
            endpoint: '/translation',
            method: POST,
            types: [
                actionType.CREATE_GROUP_REQUEST,
                {
                    type: actionType.CREATE_GROUP_SUCCESS,
                    payload: (action, state, response) => {
                        return new Group({
                            id: response.data.id,
                            name: response.data[state.user.language] || response.data.en
                        });
                    }
                },
                actionType.CREATE_GROUP_ERROR
            ],
            params: {
                type: 'group',
                value,
            },
        }
    });
};