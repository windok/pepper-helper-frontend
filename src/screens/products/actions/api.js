import ProductMapper from '../services/ProductMapper';
import * as actionType from './';

export const fetchProductCollection = () => (dispatch) => {
    dispatch({
        type: actionType.FETCH_PRODUCT_REQUEST
    });

    ProductMapper.fetchProductCollection().then(
        function (data) {
            dispatch({
                type: actionType.FETCH_PRODUCT_SUCCESS,
                productCollection: data.entities.product,
                productIds: data.result
            });
        },
        function (error) {
            // todo simulate different error, provide correct processing
            dispatch({
                type: actionType.FETCH_PRODUCT_ERROR,
                error: error,
            });
        }
    );
};

export const addProduct = (name) => (dispatch) => {
    dispatch({
        type: actionType.ADD_PRODUCT_REQUEST
    });

    ProductMapper.addProduct({
        name: name,
        state: 'toBuy'
    }).then(
        function (data) {
            dispatch({
                type: actionType.ADD_PRODUCT_SUCCESS,
                productCollection: data.entities.product,
                productId: data.result
            });
        },
        function (error) {
            // todo simulate different error, provide correct processing
            dispatch({
                type: actionType.ADD_PRODUCT_ERROR,
                error: error,
            });
        }
    );
};

export const deleteProduct = (productId) => (dispatch) => {
    dispatch({
        type: actionType.DELETE_PRODUCT_REQUEST,
        productId: productId
    });

    ProductMapper.deleteProduct(productId).then(
        function (response) {
            dispatch({
                type: actionType.DELETE_PRODUCT_SUCCESS,
            });
        },
        function (error) {
            // todo simulate different error, provide correct processing
            dispatch({
                type: actionType.DELETE_PRODUCT_ERROR,
            });
        }
    );
};