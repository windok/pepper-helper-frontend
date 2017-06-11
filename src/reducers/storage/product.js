import * as actionType from 'Actions';

const initialState = {
    items: new Map(),
    isFetching: false,
    searchResults: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.FETCH_PRODUCT_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_PRODUCT_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_PRODUCT_COLLECTION_SUCCESS: {
            return {...state, isFetching: false, items: new Map([...state.items, ...action.payload])};
        }
        case actionType.SEARCH_PRODUCT_SUCCESS:
            return {...state, searchResults: {...state.searchResults, [action.meta.query]: [...action.payload]}};
        case actionType.CREATE_PRODUCT_SUCCESS:
            return {...state, items: {...state.items, [action.payload.id]: action.payload.clone()}}
    }

    return state;
};
