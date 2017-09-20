import * as actionType from 'Actions';
import {API_CALL, GET} from 'Store/api-middleware/RSAA';
import Unit from 'Models/Unit';

export const fetchAll = () => (dispatch) => {
    return dispatch({
        [API_CALL]: {
            endpoint: '/unit',
            method: GET,
            types: [
                actionType.FETCH_UNIT_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_UNIT_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const unitCollection = new Map();

                        (response.data.items || []).forEach(unitData => {
                            unitCollection.set(unitData.id, new Unit({...unitData, tmpId: unitData.tmpId || ''}))
                        });

                        return unitCollection;
                    }
                },
                actionType.FETCH_UNIT_COLLECTION_ERROR
            ],
            params: {
                limit: 1000
            },
        }
    });
};
