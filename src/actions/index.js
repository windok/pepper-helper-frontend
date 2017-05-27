import axios from 'axios';

export const FETCH_PRODUCT_LIST_REQUEST = 'FETCH_PRODUCT_LIST_REQUEST';
export const FETCH_PRODUCT_LIST_SUCCESS = 'FETCH_PRODUCT_LIST_SUCCESS';
export const FETCH_PRODUCT_LIST_ERROR = 'FETCH_PRODUCT_LIST_ERROR';

const phClient = axios.create({
    baseURL: 'https://api.pepper-helper.dev:8080/',
    timeout: 2000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json'
    }
});


export const fetchProductLists = () => (dispatch) => {
    dispatch({
        type: FETCH_PRODUCT_LIST_REQUEST
    });

    phClient.get('/product-list')
        .then((result) => {
            const lists = result.data.items;

            dispatch({
                type: FETCH_PRODUCT_LIST_SUCCESS,
                lists
            });

        }, (error) => {
            dispatch({
                type: FETCH_PRODUCT_LIST_ERROR,
                error
            });

        });
};
