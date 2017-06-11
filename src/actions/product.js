import * as actionType from 'Actions';
import RestClient from 'Services/RestClient';
import Store from 'Store';
import {API_CALL, GET} from 'Store/api-middleware/RSAA';
import Product from 'Models/Product';

export const fetchAll = () => (dispatch) => {
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
                                id: productTranslation.id,
                                name: productTranslation[state.storage.user.language] || productTranslation.en
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

export const searchProductTranslation = (query) => (dispatch) => {
    if (query.length < 2) {
        return Promise.resolve();
    }

    dispatch({
        type: actionType.SEARCH_TRANSLATION_REQUEST
    });

    RestClient.get('/translation/search', {params: {value: query, type: 'product', limit: 50}})
        .then((result) => {
            const items = result.data.items || [];

            dispatch({
                type: actionType.SEARCH_TRANSLATION_SUCCESS,
                query,
                items
            });

            return items;
        }, (error) => {
            dispatch({
                type: actionType.SEARCH_TRANSLATION_ERROR,
                query,
                error
            });

            return error;
        });
};

const createTranslation = (type, value) => (dispatch) => {
    dispatch({
        type: actionType.CREATE_PRODUCT_TRANSLATION_REQUEST
    });

    return RestClient.post('/translation', {type, [Store.getState().storage.user.language]: value})
        .then((result) => {
            dispatch({
                type: actionType.CREATE_PRODUCT_TRANSLATION_SUCCESS,
                translation: result.data
            });

            return result.data;
        }, (error) => {
            dispatch({
                type: actionType.CREATE_PRODUCT_TRANSLATION_ERROR,
                value,
                error
            });

            return error;
        });
};

export const createProductTranslation = (value) => (dispatch) => {
    return createTranslation('product', value)(dispatch);
};
