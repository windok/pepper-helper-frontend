import * as actionType from 'Actions';
import {API_CALL, GET, POST} from 'Store/api-middleware/RSAA';
import Product from 'Models/Product';

export const fetchAll = () => (dispatch) => {
    // todo iterate if there are too much products
    // todo custom redux middleware to fetch and process collections
    dispatch({
        [API_CALL]: {
            endpoint: '/translation',
            method: GET,
            types: [
                actionType.FETCH_PRODUCT_COLLECTION_REQUEST,
                {
                    type: actionType.FETCH_PRODUCT_COLLECTION_SUCCESS,
                    payload: (action, state, response) => {
                        const productCollection = new Map();

                        (response.data.items || []).forEach(productTranslation => productCollection.set(
                            productTranslation.id,
                            new Product({
                                ...productTranslation,
                                name: productTranslation[state.storage.user.language],
                                defaultName: productTranslation.en
                            })
                        ));

                        return productCollection;
                    }
                },
                actionType.FETCH_PRODUCT_COLLECTION_ERROR
            ],
            params: {
                type: 'product',
                limit: 1000
            },
        }
    });
};

export const searchProduct = (query) => (dispatch) => {
    if (query.length < 2) {
        return Promise.resolve();
    }

    dispatch({
        [API_CALL]: {
            endpoint: '/translation/search',
            method: GET,
            types: [
                actionType.SEARCH_PRODUCT_REQUEST,
                {
                    type: actionType.SEARCH_PRODUCT_SUCCESS,
                    meta: {query},
                    payload: (action, state, response) => response.data.items.map(product => product.id)
                },
                actionType.SEARCH_PRODUCT_ERROR
            ],
            params: {
                value: query,
                type: 'product'
            },
        }
    });
};

export const createProduct = (value) => (dispatch) => {
    // todo refactor this
    return new Promise((resolve, reject) => {
        dispatch({
            [API_CALL]: {
                endpoint: '/translation',
                method: POST,
                types: [
                    actionType.CREATE_PRODUCT_REQUEST,
                    {
                        type: actionType.CREATE_PRODUCT_SUCCESS,
                        payload: (action, state, response) => {
                            const product = new Product({
                                ...response.data,
                                name: response.data.value,          // todo api should return translation object with language keys
                                defaultName: response.data.value
                            });

                            resolve(product);

                            return product;
                        }
                    },
                    actionType.CREATE_PRODUCT_ERROR
                ],
                params: {
                    type: 'product',
                    value,
                },
            }
        });
    });
};
