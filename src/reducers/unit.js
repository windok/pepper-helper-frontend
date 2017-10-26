import * as actionType from 'Actions';
import {Unit, UnitNullObject} from 'Models/Unit';

const initialState = {
    items: new Map(),
    userUnits: new Set()
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            // case actionType.FETCH_UNIT_COLLECTION_REQUEST:
            // case actionType.FETCH_UNIT_COLLECTION_ERROR:
            //     return {...state};

            case actionType.FETCH_UNIT_COLLECTION_SUCCESS: {
                const userUnits = new Set([...state.userUnits]);

                action.payload.items.forEach(unit => {
                    if (unit.getType() === action.payload.userUnitType) {
                        userUnits.add(unit.getId());
                    }
                });

                return {
                    ...state,
                    items: new Map([...state.items, ...action.payload.items]),
                    userUnits
                };
            }

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => {
            return {
                items: Array.from(state.items.entries(), ([unitId, unit]) => [unitId, unit.serialize()]),
                userUnits: Array.from(state.userUnits)
            };
        },
        rehydrate: (persistedState) => {
            return {
                items: new Map(persistedState.items.map(([unitId, unitData]) => [unitId, new Unit(unitData)])),
                userUnits: new Set(persistedState.userUnits)
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
 * @return {Unit}
 */
export const getFirst = (state) => {
    return state.unit.items.values().next().value || new UnitNullObject();
};

/**
 * @param state
 * @return {Unit}
 */
export const getFirstUserUnit = (state) => {
    return getUnit(state, state.unit.userUnits.values().next().value);
};

/**
 * @param state
 * @return {Map}
 */
export const getUnitCollection = (state) => {
    return state.unit.items;
};

/**
 * @param state
 * @return {Map}
 */
export const getUserUnitCollection = (state) => {
    return new Map(Array.from(state.unit.items).filter(([unitId]) => state.unit.userUnits.has(unitId)));
};
