import * as actionType from 'Actions';
import {Product, ProductNullObject} from 'Models/Product';

const initialState = {
    items: new Map(),
    searchResults: {},
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.FETCH_PRODUCT_COLLECTION_SUCCESS:
                return {...state, items: new Map([...state.items, ...action.payload])};

            case actionType.SEARCH_PRODUCT_SUCCESS:
                return {
                    ...state,
                    searchResults: {...state.searchResults, [action.meta.query]: [...action.payload]}
                };

            case actionType.CREATE_PRODUCT_OFFLINE:
                return {
                    ...state,
                    items: (new Map([...state.items])).set(action.payload.getIdentifier(), action.payload.clone())
                };

            case actionType.CREATE_PRODUCT_SUCCESS: {
                const items = new Map([...state.items]);
                items.delete(action.payload.getTmpId());
                items.set(action.payload.getIdentifier(), action.payload.clone());

                return {...state, items};
            }

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            items: Array.from(state.items.entries(), (([productId, product]) => [productId, product.serialize()])),
        }),
        rehydrate: (state) => ({
            ...initialState,
            items: new Map(state.items.map(([productId, productData]) => [productId, new Product(productData)])),
        })
    });

/**
 * @param state
 * @param id
 * @return {Product}
 */
export const getProduct = (state, id) => {
    if (typeof id === 'string') {
        return id.includes('-') ? getProductByTmpId(state, id) : getProduct(state, parseInt(id))
    }

    return state.product.items.get(id) || new ProductNullObject();
};

/**
 * @param state
 * @param tmpId
 * @return {Product}
 */
export const getProductByTmpId = (state, tmpId) => {
    return state.product.items.get(tmpId)
        || Array.from(state.product.items.values()).filter(product => product.getTmpId() === tmpId)[0]
        || new ProductNullObject()
};

/**
 * @param state
 * @return {Map}
 */
export const getProductCollection = (state) => {
    return state.product.items;
};

export const findBestSearchResults = (state, query) => {
    if (!query.trim()) {
        return [];
    }

    query = query.toLowerCase();

    return Array.from(state.product.items.values())
        .filter(product => product.getName().toLowerCase().includes(query));
};

export const findProductByName = (state, productName) => {
    for (let product of state.product.items.values()) {
        if (product.getName() === productName) {
            return product;
        }
    }

    return null;
};