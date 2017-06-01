import * as actionType from 'Actions';

export default (state = {data: {}, isFetching: false}, action) => {
    switch (action.type) {
        case actionType.FETCH_LIST_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_LIST_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_LIST_COLLECTION_SUCCESS: {
            let serverLists = {};

            action.listCollection.forEach((list) => {
                serverLists[list.id] = {...list, listItems: []};
            });

            return {isFetching: false, data: {...state.data, ...serverLists}};
        }

        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS: {
            const newState = {...state};
            newState.data[action.listId].listItems = action.listItems.map((item) => item.id);

            return newState;
        }
    }

    return state;
};
