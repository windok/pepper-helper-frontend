import moment from 'moment';
import {Observable} from "rxjs/Observable";

import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';

import {isOnline, isBackendConnected} from 'Reducers/app'

import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';


export const changeOnlineStatus = (onlineStatus) => ({
    type: actionType.ONLINE_STATUS_CHANGE,
    payload: onlineStatus
});

export const changeBackendConnectionStatus = (backendConnectionStatus) => ({
    type: actionType.BACKEND_CONNECTION_STATUS_CHANGE,
    payload: backendConnectionStatus
});

export const onlineEpic = (action$, store) => action$
    // todo get rid of browser dependency for native compatibility
    .map(() => navigator.onLine)
    .filter(online => isOnline(store.getState()) !== online)
    .map(changeOnlineStatus);

export const backendConnectionEpic = (action$, store) => action$
    .map(() => SocketClient.isConnected())
    .filter(backendConnectionStatus => isBackendConnected(store.getState()) !== backendConnectionStatus)
    .map(changeBackendConnectionStatus);

export const startColdStart = () => ({
    type: actionType.SYNC_COLD_START_STARTED,
    meta: {
        time: moment.utc()
    }
});

export const finishColdStart = () => ({
    type: actionType.SYNC_COLD_START_FINISHED,
    meta: {
        time: moment.utc()
    }
});

export const coldStartEpic = (action$, store) => action$
    .ofType(actionType.SYNC_COLD_START_STARTED)
    .do(() => console.log('start cold start'))
    .mergeMap(() => (
        Observable.fromPromise(Promise.all([
            fetchProductListCollection()(store.dispatch),
            fetchProductCollection()(store.dispatch),
            fetchUnitCollection()(store.dispatch),
            fetchGroupCollection()(store.dispatch)
        ]))
            .catch(error => Observable.of({error: error})))
    )
    .map(finishColdStart);

