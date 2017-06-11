import * as actionType from 'Actions';

export default (state = {items: new Map(), template: {}}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS: {
            return {...state, items: new Map([...state.items, ...action.payload])};
        }
        case actionType.GET_ITEM_TEMPLATE_SUCCESS: {
            return {...state, template: {...action.template}}
        }
        case actionType.CREATE_ITEM_SUCCESS:
            return {items: {...state.items, [action.listItem.id]: {...action.listItem}}, template: {}};
    }

    return state;
};
