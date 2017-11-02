import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';

import {isOnline, isBackendConnected} from 'Reducers/app'

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
    .do((action) => console.log('ccccon', action, SocketClient.isConnected(), isBackendConnected(store.getState())))
    .map(() => SocketClient.isConnected())
    .filter(backendConnectionStatus => isBackendConnected(store.getState()) !== backendConnectionStatus)
    .map(changeBackendConnectionStatus);