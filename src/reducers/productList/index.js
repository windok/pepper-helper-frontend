import * as actionType from 'Actions';

const ProductList = (state = {}, action) => {
    switch (action.type) {
        case actionType.FETCH_PRODUCT_LIST_SUCCESS: {
            return {...state, ...action.lists};
        }
    }

    return state;
};

export default ProductList;