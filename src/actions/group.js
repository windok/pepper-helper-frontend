import * as actionType from 'Actions';
import {API_CALL, GET, POST} from 'Store/api-middleware/RSAA';
import {SOCKET_CALL} from 'Store/socket-middleware';
import Group from 'Models/Group';
import store from 'Store';
import {getUserLanguage} from 'Reducers/user';
import uuid from 'uuid/v4';

export const fetchAll = () => (dispatch) => {

    return dispatch({
        [SOCKET_CALL]: {
            action: 'translation-load',
            payload: {
                type: 'group',
                limit: 1000
            },
            types: [
                actionType.FETCH_GROUP_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_GROUP_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const groupCollection = new Map();

                        (response.items || []).forEach(groupData => groupCollection.set(
                            groupData.id,
                            new Group({
                                ...groupData,
                                tmpId: groupData.tmpId || '',
                                name: groupData[getUserLanguage(state)] || groupData.en
                            })
                        ));

                        return groupCollection;
                    }
                },
                actionType.FETCH_GROUP_COLLECTION_ERROR
            ],
        }
    });
};


export const createGroup = (value) => (dispatch) => {
    const group = new Group({
        id: 0,
        tmpId: uuid(),
        name: value
    });
    return dispatch({
        [SOCKET_CALL]: {
            action: 'translation-create',
            payload: {
                ...group.serialize(),
                type: 'group',
                language: getUserLanguage(store.getState()),
                value
            },
            types: [
                {
                    type: actionType.CREATE_GROUP_REQUEST,
                    payload: {group}
                },
                {
                    type: actionType.CREATE_GROUP_SUCCESS,
                    payload: (action, state, response) => {
                        return new Group({
                            ...response,
                            tmpId: response.tmpId || '',
                            name: response[getUserLanguage(state)] || response.en
                        });
                    }
                },
                actionType.CREATE_GROUP_ERROR
            ],
        }
    });
};