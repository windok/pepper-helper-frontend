import uuid from 'uuid/v4';

import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';

import Group from 'Models/Group';

import {getGroupByName} from 'Reducers/group';
import {getUser} from 'Reducers/user';

const buildGroupCollectionFromResponse = (state, groups = []) => {
    const groupCollection = new Map();

    groups.forEach(groupData => groupCollection.set(
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

export const fetchAll = () => ({
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
                payload: (action, state, response) => buildGroupCollectionFromResponse(state, response.items),
            },
            actionType.FETCH_GROUP_COLLECTION_ERROR
        ],
    }
});

export const fetchGroupDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => action.payload.data.translations.items.filter(translation => translation.type === 'group'))
    .filter(groups => groups.length)
    .map(groups => ({
        type: actionType.FETCH_GROUP_COLLECTION_SUCCESS,
        payload: buildGroupCollectionFromResponse(store.getState(), groups),
    }));

export const createGroup = (value) => (dispatch, getState) => {
    const existingGroup = getGroupByName(getState(), value);

    if (!existingGroup.isNullObject()) {
        return existingGroup;
    }

    const group = new Group({
        id: 0,
        tmpId: uuid(),
        name: value,
        color: '',
        userId: getUser(getState()).getId()
    });

    dispatch({
        type: actionType.CREATE_GROUP_OFFLINE,
        payload: group,
        sync: {
            name: 'translation-create',
            payload: (state) => ({
                ...group.serialize(),
                value,
                type: 'group',
                language: getUser(state).getLanguage()
            }),
            successAction: actionType.CREATE_GROUP_SUCCESS,
            errorAction: actionType.CREATE_GROUP_ERROR
        }
    });

    return group;
};