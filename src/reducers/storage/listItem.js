import * as actionType from 'Actions';

export default (state = {items: {},  template: {}}, action) => {
    switch (action.type) {
        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS: {
            let serverItems = {};
            action.listItems.forEach((listItem) => {
                serverItems[listItem.id] = {...listItem};
            });

            return {...state, items: {...state.items, ...serverItems}};
        }
        case actionType.GET_ITEM_TEMPLATE_SUCCESS: {
            return {...state, template: {...action.template}}
        }
        case actionType.CREATE_ITEM_SUCCESS:
            return {items: {...state.items, [action.listItem.id]: {...action.listItem}}, template: {}};
    }

    return state;
};
