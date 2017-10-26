import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';

import Unit from 'Models/Unit';

import {getUser} from 'Reducers/user';

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
                    payload: (action, state, response) => {
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
                    }
                },
                actionType.FETCH_UNIT_COLLECTION_ERROR
            ],
        }
    });
};
