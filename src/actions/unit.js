import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';

import Unit from 'Models/Unit';

import {getUser} from 'Reducers/user';

const buildUnitCollectionFromResponse = (state, response) => {
    const unitCollection = new Map();

    (response.items || []).forEach(unitData => unitCollection.set(
        unitData.id,
        new Unit({
            ...unitData,
            tmpId: unitData.tmpId || ''
        })
    ));

    return {
        items: unitCollection,
        userUnitType: getUser(state).getUnitType()
    };
};

export const fetchAll = () => (dispatch) => {
    return dispatch({
        [SOCKET_CALL]: {
            action: 'unit-load',
            payload: {
                limit: 1000
            },
            types: [
                actionType.FETCH_UNIT_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_UNIT_COLLECTION_SUCCESS,
                    payload: (action, state, response) => buildUnitCollectionFromResponse(state, response)
                },
                actionType.FETCH_UNIT_COLLECTION_ERROR
            ],
        }
    });
};

export const fetchUnitDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => ({
        type: actionType.FETCH_UNIT_COLLECTION_SUCCESS,
        payload: buildUnitCollectionFromResponse(store.getState(), action.payload.units)
    }));

