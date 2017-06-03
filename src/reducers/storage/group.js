import * as actionType from 'Actions';

export default (state = {items: {}, isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_GROUP_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_GROUP_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_GROUP_COLLECTION_SUCCESS: {
            let serverItems = {};

            action.items.forEach((group) => {
                serverItems[group.id] = group;
            });

            return {isFetching: false, items: {...state.items, ...serverItems}};
        }
    }

    return state;
};
