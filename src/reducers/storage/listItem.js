import * as actionType from 'Actions';

export default (state = {items: new Map(), template: null}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS: {
            return {...state, items: new Map([...state.items, ...action.payload])};
        }
        case actionType.GET_ITEM_TEMPLATE_SUCCESS: {
            return {...state, template: action.payload.clone()}
        }
        case actionType.CREATE_ITEM_SUCCESS:
            return {items: {...state.items, [action.listItem.id]: {...action.listItem}}, template: null};
    }

    return state;
};
