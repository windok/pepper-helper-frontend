import axios from 'axios';
import Config from 'Config';

export const FETCH_LIST_COLLECTION_REQUEST = 'FETCH_PRODUCT_LIST_COLLECTION_REQUEST';
export const FETCH_LIST_COLLECTION_SUCCESS = 'FETCH_PRODUCT_LIST_COLLECTION_SUCCESS';
export const FETCH_LIST_COLLECTION_ERROR = 'FETCH_PRODUCT_LIST_COLLECTION_ERROR';

export const FETCH_ITEMS_FOR_LIST_REQUEST = 'FETCH_LIST_ITEMS_REQUEST';
export const FETCH_ITEMS_FOR_LIST_SUCCESS = 'FETCH_LIST_ITEMS_SUCCESS';
export const FETCH_ITEMS_FOR_LIST_ERROR = 'FETCH_LIST_ITEMS_ERROR';

const phClient = axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 2000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json'
    }
});


export const fetchProductListCollection = () => (dispatch) => {
    console.log('fetching list collection');

    dispatch({
        type: FETCH_LIST_COLLECTION_REQUEST
    });

    phClient.get('/product-list')
        .then((result) => {
            const listCollection = result.data.items || [];

            dispatch({
                type: FETCH_LIST_COLLECTION_SUCCESS,
                listCollection
            });

            // todo fetch some how different
            listCollection.forEach((list) => fetchListItems(list.id)(dispatch));
        }, (error) => {
            dispatch({
                type: FETCH_LIST_COLLECTION_ERROR,
                error
            });

        });
};

export const fetchListItems = (listId) => (dispatch) => {

    if (listId == 0 || listId == '0') {
        return;
    }

    dispatch({
        type: FETCH_ITEMS_FOR_LIST_REQUEST,
        listId
    });

    phClient.get('/list-item', {params: {listId}})
        .then((result) => {
            const listItems = result.data.items || [];

            dispatch({
                type: FETCH_ITEMS_FOR_LIST_SUCCESS,
                listId,
                listItems
            });

        }, (error) => {
            dispatch({
                type: FETCH_ITEMS_FOR_LIST_ERROR,
                listId,
                error
            });

        });
};

