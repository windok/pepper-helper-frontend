import * as actionType from 'Actions';

const initialState = {
    items: {},
    isFetching: false,
    searchProductResults: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.FETCH_TRANSLATION_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_TRANSLATION_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_TRANSLATION_COLLECTION_SUCCESS: {
            let serverItems = {};

            action.items.forEach((translation) => {
                serverItems[translation.id] = translation;
            });

            return {...state, isFetching: false, items: {...state.items, ...serverItems}};
        }
        case actionType.SEARCH_TRANSLATION_SUCCESS:
            console.log(action);

            return {...state, searchProductResults: {...state.searchProductResults, [action.query] : action.items}}
    }

    return state;
};
