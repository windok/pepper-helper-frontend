import {Observable} from "rxjs/Observable";

import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';

import {isRehydrationCompleted, isColdStartBegun, isColdStartFinished, isAppReady, isOnline, isBackendConnected} from 'Reducers/app'
import {getUser} from 'Reducers/user'

import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductListItemCollection} from 'Actions/listItem';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';

export const appReady = () => ({
    type: actionType.APP_READY
});

export const changeOnlineStatus = (onlineStatus) => ({
    type: actionType.ONLINE_STATUS_CHANGE,
    payload: onlineStatus
});

export const changeBackendConnectionStatus = (backendConnectionStatus) => ({
    type: actionType.BACKEND_CONNECTION_STATUS_CHANGE,
    payload: backendConnectionStatus
});

export const appReadyEpic = (action$, store) => action$
    .map(() => store.getState())
    .filter(state => (
        !isAppReady(state)
        && isColdStartFinished(state)
        && getUser(state) && !getUser(state).isTokenExpired()
    ))
    .map(appReady);

export const onlineEpic = (action$, store) => action$
    // todo get rid of browser dependency for native compatibility
    .map(() => navigator.onLine)
    .filter(online => isOnline(store.getState()) !== online)
    .map(changeOnlineStatus);

export const backendConnectionEpic = (action$, store) => action$
    .do(() => !SocketClient.isConnected() && SocketClient.connect())
    .map(() => store.getState())
    .filter(state => isBackendConnected(state) !== SocketClient.isConnected())
    .map(() => changeBackendConnectionStatus(SocketClient.isConnected()));

export const beginColdStart = () => ({
    type: actionType.APP_COLD_START_BEGUN
});

export const finishColdStart = () => ({
    type: actionType.APP_COLD_START_FINISHED
});

export const beginColdStartEpic = (action$, store) => action$
    .map(() => store.getState())
    .filter((state) => (
        isRehydrationCompleted(state) && getUser(state) && !getUser(state).isTokenExpired()
        && !isColdStartBegun(state) && !isColdStartFinished(state)
    ))
    .do(() => console.log('begin cold start'))
    .map(beginColdStart);

export const coldStartEpic = (action$, store) => action$
    .ofType(actionType.APP_COLD_START_BEGUN)
    .do(() => console.log('load all resources'))
    .mergeMap(() => (
        Observable.fromPromise(Promise.all([
            store.dispatch(fetchProductListCollection()),
            store.dispatch(fetchProductListItemCollection()),
            store.dispatch(fetchProductCollection()),
            store.dispatch(fetchUnitCollection()),
            store.dispatch(fetchGroupCollection())
        ]))
            .catch(error => Observable.of({error: error})))
    )
    .map(finishColdStart);

export const addToast = (toast) => ({
    type: actionType.SNACKBAR_ADD_TOAST,
    payload: toast
});

export const releaseToast = () => ({
    type: actionType.SNACKBAR_RELEASE_TOAST,
});

