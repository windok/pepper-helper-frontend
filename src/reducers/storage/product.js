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
        case actionType.SEARCH_TRANSLATION_SUCCESS:
            return {...state, searchResults: {...state.searchResults, [action.query]: action.items}};
        case actionType.CREATE_PRODUCT_TRANSLATION_SUCCESS:
            return {...state, items: {...state.items, [action.product.id]: action.product}}
    }

    return state;
};
