import uuid from 'uuid/v4';

import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';

import Group from 'Models/Group';

import {getUser} from 'Reducers/user';

const buildGroupCollectionFromResponse = (state, response) => {
    const groupCollection = new Map();

    (response.items || []).forEach(groupData => groupCollection.set(
        groupData.id,
        new Group({
            ...groupData,
            tmpId: groupData.tmpId || '',
            color: groupData.img || '',
            name: groupData[getUser(state).getLanguage()] || groupData.en
        })
    ));

    return groupCollection;
};

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
                    payload: (action, state, response) => buildGroupCollectionFromResponse(state, response),
                },
                actionType.FETCH_GROUP_COLLECTION_ERROR
            ],
        }
    });
};

export const fetchGroupDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => ({
        type: actionType.FETCH_GROUP_COLLECTION_SUCCESS,
        payload: buildGroupCollectionFromResponse(
            store.getState(),
            {
                items: action.payload.translations.items.filter(translation => translation.type === 'group')
            }
        ),
    }));

export const createGroup = (value) => (dispatch) => {
    const group = new Group({
        id: 0,
        tmpId: uuid(),
        name: value
    });
    return dispatch({
        [SOCKET_CALL]: {
            action: 'translation-create',
            payload: (state) => ({
                ...group.serialize(),
                type: 'group',
                language: getUser(state).getLanguage(),
                value
            }),
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