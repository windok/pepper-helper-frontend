import * as actionType from 'Actions';


export default (state = {items: new Map(), isFetching: false}, action) => {
    let newState;

    switch (action.type) {
        case actionType.FETCH_LIST_COLLECTION_REQUEST:
            return {...state, isFetching: true};
        case actionType.FETCH_LIST_COLLECTION_ERROR:
            return {...state, isFetching: false};
        case actionType.FETCH_LIST_COLLECTION_SUCCESS:
            return {isFetching: false, items: new Map([...state.items, ...action.payload])};

        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            const itemIds = [];
            action.payload.forEach(listItem => itemIds.push(listItem.getId()));

            const items = (new Map([...state.items]))
                .set(action.meta.list.getId(), action.meta.list.setItems(itemIds));

            return {...state, items};
        case actionType.CREATE_ITEM_SUCCESS:
            newState = {...state};
            newState.data[action.listItem.listId].listItems.push(action.listItem.id);

            return newState;
    }

    return state;
};
