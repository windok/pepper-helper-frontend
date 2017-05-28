import * as actionType from 'Actions';

export default (state = {}, action) => {
    switch (action.type) {

        case actionType.FETCH_ITEMS_FOR_LIST_SUCCESS: {
            let newState = {...state};

            action.listItems.forEach((listItem) => {
                newState[listItem.id] = {...listItem};
            });

            return newState;
        }
    }

    return state;
};
