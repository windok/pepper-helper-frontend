import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';
import Product from 'Models/Product';
import {getUserLanguage} from 'Reducers/user';
import store from 'Store';
import uuid from 'uuid/v4';

export const fetchAll = () => (dispatch) => {
    return dispatch({
        [SOCKET_CALL]: {
            action: 'translation-load',
            payload: {
                type: 'product',
                limit: 1000
            },
            types: [
                actionType.FETCH_PRODUCT_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_PRODUCT_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const productCollection = new Map();

                        (response.items || []).forEach(productData => productCollection.set(
                            productData.id,
                            new Product({
                                ...productData,
                                tmpId: productData.tmpId || '',
                                name: productData[getUserLanguage(state)],
                                defaultName: productData.en
                            })
                        ));

                        return productCollection;
                    }
                },
                actionType.FETCH_PRODUCT_COLLECTION_ERROR
            ],
        }
    });
};

export const searchProduct = (query) => (dispatch) => {
    if (query.length < 2) {
        return Promise.resolve();
    }

    dispatch({
        [SOCKET_CALL]: {
            action: 'translation-search',
            payload: {
                value: query,
                type: 'product',
                language: getUserLanguage(store.getState())
            },
            types: [
                actionType.SEARCH_PRODUCT_REQUEST,
                {
                    type: actionType.SEARCH_PRODUCT_SUCCESS,
                    meta: {query},
                    payload: (action, state, response) => response.items.map(product => product.id)
                },
                actionType.SEARCH_PRODUCT_ERROR
            ],
        }
    });
};

export const createProduct = (value) => (dispatch) => {
    // todo set appropriate userId
    const product = new Product({
        id: 0,
        tmpId: uuid(),
        name: value,
        defaultName: value,
        userId: 1
    });

    return dispatch({
        [SOCKET_CALL]: {
            action: 'translation-create',
            payload: {
                ...product.serialize(),
                value: value,
                type: 'product',
                language: getUserLanguage(store.getState())
            },
            types: [
                {
                    type: actionType.CREATE_PRODUCT_REQUEST,
                    payload: {product}
                },
                {
                    type: actionType.CREATE_PRODUCT_SUCCESS,
                    payload: (action, state, response) => {
                        return new Product({
                            ...response,
                            name: response.value,
                            defaultName: response.value
                        });
                    }
                },
                actionType.CREATE_PRODUCT_ERROR
            ],
        }
    });
};
