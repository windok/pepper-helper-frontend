import * as actionType from 'Actions';

export default (state = {items: new Map(), template: null}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            return {...state, items: new Map([...state.items, ...action.payload.recommended])};
    }

    return state;
};