import * as actionType from 'Actions';
import {Product, ProductNullObject} from 'Models/Product';

const initialState = {
    items: new Map(),
    isFetching: false,
    searchResults: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.FETCH_PRODUCT_COLLECTION_REQUEST:
            return {...state, isFetching: true};

        case actionType.FETCH_PRODUCT_COLLECTION_ERROR:
            return {...state, isFetching: false};

        case actionType.FETCH_PRODUCT_COLLECTION_SUCCESS:
            return {...state, isFetching: false, items: new Map([...state.items, ...action.payload])};

        case actionType.SEARCH_PRODUCT_SUCCESS:
            return {...state, searchResults: {...state.searchResults, [action.meta.query]: [...action.payload]}};

        case actionType.CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                items: (new Map([...state.items])).set(action.payload.getId(), action.payload.clone())
            }
    }

    return state;
};

/**
 * @param state
 * @param productId
 * @return {Product}
 */
export const getProduct = (state, productId) => {
    return state.storage.product.items.get(productId) || new ProductNullObject();
};

/**
 * @param state
 * @param productId
 * @return {Map}
 */
export const getProductCollection = (state) => {
    return state.storage.product.items;
};

export const findBestSearchResults = (state, query) => {
    let searchResults = state.storage.product.searchResults[query];

    if (searchResults === undefined) {
        let foundQuery = '';
        searchResults = [];

        Object.keys(state.storage.product.searchResults).forEach((possibleQuery) => {
            if (query.includes(possibleQuery) && possibleQuery.length > foundQuery.length) {
                foundQuery = possibleQuery;
                searchResults = state.storage.product.searchResults[foundQuery];
            }
        })
    }

    return searchResults;
};

export const findProductByName = (state, productName) => {
    for (let product of state.storage.product.items.values()) {
        if (product.getName() === productName) {
            return product;
        }
    }

    return null;
};