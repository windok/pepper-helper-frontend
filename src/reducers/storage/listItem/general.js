import * as actionType from 'Actions';

export default (state = {items: new Map(), unsavedItems: new Map(), template: null}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS:
            return {...state, items: new Map([...state.items, ...action.payload.general])};

        case actionType.GET_ITEM_TEMPLATE_SUCCESS:
            return {...state, template: action.payload.clone()};

        case actionType.SAVE_ITEM_REQUEST:
            return {
                ...state,
                unsavedItems: new Map([...state.unsavedItems]).set(action.meta.listItem.getId(), action.meta.listItem.clone()),
                template: null
            };
        case actionType.SAVE_ITEM_SUCCESS: {
            const unsavedItems = new Map([...state.unsavedItems]);
            unsavedItems.delete(action.meta.listItem.getId());

            return {
                ...state,
                items: new Map([...state.items]).set(action.payload.getId(), action.payload.clone()),
                unsavedItems,
                template: null
            };
        }

        case actionType.BUY_ITEM_REQUEST:
        case actionType.RETURN_ITEM_REQUEST:
            return {
                ...state,
                unsavedItems: new Map([...state.unsavedItems]).set(action.meta.listItem.getId(), action.meta.listItem.clone())
            };
        case actionType.BUY_ITEM_SUCCESS:
        case actionType.RETURN_ITEM_SUCCESS: {
            const unsavedItems = new Map([...state.unsavedItems]);
            unsavedItems.delete(action.meta.listItem.getId());

            return {
                ...state,
                items: new Map([...state.items]).set(action.meta.listItem.getId(), action.meta.listItem.clone()),
                unsavedItems
            };
        }
    }

    return state;
};

