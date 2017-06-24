import * as actionType from 'Actions';
import {API_CALL, GET, POST, PUT} from 'Store/api-middleware/RSAA';

import {ListItem, CustomProductListItemTemplate,
    STATUS_DRAFT, STATUS_BOUGHT, STATUS_SUSPENDED,
    TYPE_GENERAL, TYPE_RECOMMENDED} from 'Models/ListItem';

import Store from 'Store';
import {getListItem} from 'Reducers/storage/listItem';


export const fetchItemsForList = (list) => (dispatch) => {

    if (list.isNullObject()) {
        return Promise.resolve();
    }

    // todo iteration if total count is large
    // todo custom redux middleware to fetch and process collections
    dispatch({
        [API_CALL]: {
            endpoint: '/list-item',
            method: GET,
            types: [
                actionType.FETCH_ITEMS_FOR_LIST_REQUEST,
                {
                    type: actionType.FETCH_ITEMS_FOR_LIST_SUCCESS,
                    payload: (action, state, response) => {
                        const generalListItemCollection = new Map();
                        const recommendedListItemCollection = new Map();

                        (response.data.items || []).forEach(listItemData => {
                            const listItem = new ListItem({
                                ...listItemData, productId: listItemData.translationId
                            });

                            switch (listItem.getType()) {
                                case TYPE_GENERAL:
                                    return generalListItemCollection.set(listItem.getId(), listItem);
                                case TYPE_RECOMMENDED:
                                    return recommendedListItemCollection.set(listItem.getId(), listItem);
                            }
                        });

                        return {
                            general: generalListItemCollection,
                            recommended: recommendedListItemCollection
                        };
                    },
                    meta: {list}
                },
                actionType.FETCH_ITEMS_FOR_LIST_ERROR
            ],
            params: {
                listId: list.getId(),
                limit: 1000
            },
        }
    });
};

export const getTemplate = (list, product) => (dispatch) => {
    if (
        !list || !product
        || list.isNullObject() || product.isNullObject()
    ) {
        return;
    }

    const matchingListItem = getListItem(Store.getState(), list, product);
    if (!matchingListItem.isNullObject() && matchingListItem.getStatus() === STATUS_DRAFT) {
        dispatch({
            type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
            meta: {list, product},
            payload: matchingListItem.clone()
        });

        return;
    }

    if (product.isCustom()) {
        let groupId = 0;
        let unitId = 0;

        for (let [key, value] of Store.getState().storage.group.items) {
            groupId = key;
            break;
        }

        for (let [key, value] of Store.getState().storage.unit.items) {
            unitId = key;
            break;
        }

        dispatch({
            type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
            meta: {list, product},
            payload: new CustomProductListItemTemplate(list.getId(), product.getId(), groupId, unitId, 0)
        });

        return;
    }

    dispatch({
        [API_CALL]: {
            endpoint: '/list-item-template/' + product.getId() + '/' + list.getId(),
            method: GET,
            types: [
                actionType.GET_ITEM_TEMPLATE_REQUEST,
                {
                    type: actionType.GET_ITEM_TEMPLATE_SUCCESS,
                    meta: {list, product},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        id: response.data.id || 0,
                        date: response.data.date || new Date(),
                        productId: response.data.translationId
                    })
                },
                actionType.GET_ITEM_TEMPLATE_ERROR
            ]
        }
    });
};

export const saveItem = (listItem) => (dispatch) => {
    const postData = listItem.serialize();
    postData.translationId = listItem.getProductId();

    const date = new Date();
    // 2017-06-03 20:55:26
    postData.date = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

    dispatch({
        [API_CALL]: {
            endpoint: '/list-item' + (listItem.getId() ? '/' + listItem.getId() : ''),
            method: listItem.getId() ? PUT : POST,
            types: [
                // todo create item in offline storage before request is sent
                {
                    type: actionType.SAVE_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.SAVE_ITEM_SUCCESS,
                    meta: {listItem},
                    payload: (action, state, response) => new ListItem({
                        ...response.data,
                        date: response.data.date || new Date(),
                        productId: response.data.translationId
                    })
                },
                actionType.SAVE_ITEM_ERROR
            ],
            params: postData,
        }
    });
};

/**
 * @param {ListItem} listItem
 */
export const buyItem = (listItem) => (dispatch) => {
    if (listItem.getStatus() !== STATUS_DRAFT) {
        return;
    }

    listItem = new ListItem({...listItem.serialize(), status: STATUS_BOUGHT});

    dispatch({
        [API_CALL]: {
            endpoint: '/list-item/buy/' + listItem.getId(),
            method: PUT,
            types: [
                {
                    type: actionType.BUY_ITEM_REQUEST,
                    meta: {listItem}
                },
                {
                    type: actionType.BUY_ITEM_SUCCESS,
                    meta: {listItem},
                },
                actionType.BUY_ITEM_ERROR
            ],
        }
    });
};