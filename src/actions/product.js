import uuid from 'uuid/v4';

import * as actionType from 'Actions';
import {SOCKET_CALL} from 'Store/socket-middleware';

import Product from 'Models/Product';

import {getUser} from 'Reducers/user';

import {addSyncCompleteHandler} from 'Actions/sync';

const buildProductCollectionFromResponse = (state, products = []) => {
    const productCollection = new Map();

    products.forEach(productData => productCollection.set(
        productData.id,
        new Product({
            ...productData,
            tmpId: productData.tmpId || '',
            name: productData[getUser(state).getLanguage()],
            defaultName: productData.en || productData.ru || ''
        })
    ));

    return productCollection;
};

export const fetchAll = () => ({
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
                payload: (action, state, response) => buildProductCollectionFromResponse(state, response.items)
            },
            actionType.FETCH_PRODUCT_COLLECTION_ERROR
        ],
    }
});

export const fetchProductDiffEpic = (action$, store) => action$
    .ofType(actionType.SYNC_DIFF_SUCCESS)
    .map(action => action.payload.data.translations.items.filter(translation => translation.type === 'product'))
    .filter(products => products.length)
    .map(products => ({
        type: actionType.FETCH_PRODUCT_COLLECTION_SUCCESS,
        payload: buildProductCollectionFromResponse(store.getState(), products),
    }));

export const createProduct = (value) => (dispatch, getState) => {
    const product = new Product({
        id: 0,
        tmpId: uuid(),
        name: value,
        defaultName: value,
        userId: getUser(getState()).getId()
    });

    dispatch({
        type: actionType.CREATE_PRODUCT_OFFLINE,
        payload: product,
        sync: {
            name: 'translation-create',
            payload: (state) => ({
                ...product.serialize(),
                value: product.getName(),
                type: 'product',
                language: getUser(state).getLanguage()
            }),
            successAction: actionType.CREATE_PRODUCT_SUCCESS,
            errorAction: actionType.CREATE_PRODUCT_ERROR
        }
    });

    return product;
};


addSyncCompleteHandler({
    match: ({response, syncAction}) =>
        syncAction.getName() === 'translation-create'
        && syncAction.getPayload().type === 'product',
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction(),
        meta: syncAction.getMeta(),
        payload: new Product({
            ...response,
            name: response.value,
            defaultName: response.value
        })
    }),
});