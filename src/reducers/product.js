import * as actionType from 'Actions';
import {Product, ProductNullObject} from 'Models/Product';

const initialState = {
    items: new Map(),
    searchResults: {},
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            // case actionType.FETCH_PRODUCT_COLLECTION_REQUEST:
            // case actionType.FETCH_PRODUCT_COLLECTION_ERROR:
            //     return {...state};

            case actionType.FETCH_PRODUCT_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

            case actionType.SEARCH_PRODUCT_SUCCESS:
                return {
                    ...state,
                    searchResults: {...state.searchResults, [action.meta.query]: [...action.payload]}
                };

            case actionType.CREATE_PRODUCT_SUCCESS:
                return {
                    ...state,
                    items: (new Map([...state.items])).set(action.payload.getId(), action.payload.clone())
                }
        }

        return state;
    },
    {
        persist: (state) => {
            return {
                items: Array.from(state.items.entries(), (([productId, product]) => [productId, product.serialize()]))
            };
        },
        rehydrate: (state) => {
            return {
                items: new Map(state.items.map(([productId, productData]) => [productId, new Product(productData)]))
            };
        }
    });

/**
 * @param state
 * @param productId
 * @return {Product}
 */
export const getProduct = (state, productId) => {
    return state.product.items.get(productId) || new ProductNullObject();
};

/**
 * @param state
 * @param productId
 * @return {Map}
 */
export const getProductCollection = (state) => {
    return state.product.items;
};

export const findBestSearchResults = (state, query) => {
    let searchResults = state.product.searchResults[query];

    if (searchResults === undefined) {
        let foundQuery = '';
        searchResults = [];

        Object.keys(state.product.searchResults).forEach((possibleQuery) => {
            if (query.includes(possibleQuery) && possibleQuery.length > foundQuery.length) {
                foundQuery = possibleQuery;
                searchResults = state.product.searchResults[foundQuery];
            }
        })
    }

    return searchResults;
};

export const findProductByName = (state, productName) => {
    for (let product of state.product.items.values()) {
        if (product.getName() === productName) {
            return product;
        }
    }

    return null;
};