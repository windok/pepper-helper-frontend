import * as actionType from 'Actions';

export default (state = {items: {}, isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_CATEGORY_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_CATEGORY_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_CATEGORY_COLLECTION_SUCCESS: {
            let serverItems = {};

            action.items.forEach((category) => {
                serverItems[category.id] = category;
            });

            return {isFetching: false, items: {...state.data, ...serverItems}};
        }
    }

    return state;
};
