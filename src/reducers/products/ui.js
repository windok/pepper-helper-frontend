import {combineReducers} from 'redux';
import * as actionType from '../actions';

const uiCollection = () => {

    const ids = (state = [], action) => {
        switch (action.type) {
            case actionType.ADD_PRODUCT_SUCCESS:
                return [
                    ...state,
                    action.productId
                ];
            case actionType.FETCH_PRODUCT_SUCCESS:
                return [...action.productIds];
            case actionType.DELETE_PRODUCT_REQUEST:
                return state.filter(id => id !== action.productId);
            // todo restore product if api error occur
            case actionType.DELETE_PRODUCT_ERROR:
                return state;
            default:
                return state;
        }
    };

    return combineReducers({
        ids
    });
};

export default uiCollection;