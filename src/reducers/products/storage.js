import * as actionType from 'Actions';

function productStorage(state = {}, action) {
    switch (action.type) {
        case actionType.ADD_PRODUCT_SUCCESS:
        case actionType.FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                ...action.productCollection
            };
        case actionType.DELETE_PRODUCT_REQUEST:
            const nextState = {...state};
            delete nextState[action.id];

            return nextState;
        // todo restore product if api error occur
        case actionType.DELETE_PRODUCT_ERROR:
            return state;
        default:
            return state;
    }
}

export default productStorage;