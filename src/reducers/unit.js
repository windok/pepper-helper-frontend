import * as actionType from 'Actions';
import {Unit, UnitNullObject} from 'Models/Unit';

const initialState = {
    items: new Map(),
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            // case actionType.FETCH_UNIT_COLLECTION_REQUEST:
            // case actionType.FETCH_UNIT_COLLECTION_ERROR:
            //     return {...state};

            case actionType.FETCH_UNIT_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => {
            return {
                items: Array.from(state.items.entries(), ([unitId, unit]) => [unitId, unit.serialize()])
            };
        },
        rehydrate: (persistedState) => {
            return {
                items: new Map(persistedState.items.map(([unitId, unitData]) => [unitId, new Unit(unitData)]))
            }
        }
    }
);


/**
 * @param state
 * @param id
 * @return {Unit}
 */
export const getUnit = (state, id) => {
    return state.unit.items.get(id) || new UnitNullObject();
};

/**
 * @param state
 * @return {Map}
 */
export const getUnitCollection = (state) => {
    return state.unit.items;
};
