import * as actionType from 'Actions';

export default (state = {items: new Map(), isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_GROUP_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_GROUP_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_GROUP_COLLECTION_SUCCESS: {
            return {isFetching: false, items: new Map([...state.items, ...action.payload])};
        }
    }

    return state;
};
