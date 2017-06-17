import * as actionType from 'Actions';
import {Unit, UnitNullObject} from 'Models/Unit';

export default (state = {items: new Map(), isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_UNIT_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_UNIT_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_UNIT_COLLECTION_SUCCESS: {
            return {isFetching: false, items: new Map([...state.items, ...action.payload])};
        }
    }

    return state;
};


/**
 * @param state
 * @param id
 * @return {Unit}
 */
export const getUnit = (state, id) => {
    return state.storage.unit.items.get(id) || new UnitNullObject();
};

/**
 * @param state
 * @return {Map}
 */
export const getUnitCollection = (state) => {
    return state.storage.unit.items;
};
