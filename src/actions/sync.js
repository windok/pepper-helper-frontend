import uuid from 'uuid';
import {Observable} from "rxjs/Observable";

import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';

import SyncAction from "Models/SyncAction";
import SocketAction from 'Models/SocketAction';

import {getProcessingAction, isQueueEmpty, isSyncInProgress} from 'Reducers/sync';
import {getUser} from 'Reducers/user'

export const createSyncAction = (syncAction) => ({
    type: actionType.SYNC_ACTION_CREATE,
    payload: syncAction
});

export const startSync = () => ({
    type: actionType.SYNC_START
});

export const finishSync = (meta) => ({
    type: actionType.SYNC_FINISHED,
    meta
});

export const createSyncActionEpic = (action$, store) => action$
    .filter((action) => typeof action.sync === 'object' && action.sync.name)
    .map((action) => {
        const payload = typeof action.sync.payload === 'function'
            ? action.sync.payload(store.getState())
            : action.sync.payload || action.payload.serialize() || {};

        return createSyncAction(new SyncAction({
            ...action.sync,
            id: uuid(),
            payload,
        }))
    });


export const startSyncEpic = (action$, store) => action$
    .filter(() => !isQueueEmpty(store.getState()) && !isSyncInProgress(store.getState()))
    .do(() => console.log('start sync'))
    .map(startSync);

export const syncEpic = (action$, store) => action$
    .ofType(actionType.SYNC_START)
    .filter(() => getUser(store.getState()))
    .mergeMap(() => {
        const syncAction = getProcessingAction(store.getState());

        console.log('sync started with action', syncAction);

        const socketAction = new SocketAction({
            id: syncAction.getId(),
            name: syncAction.getName(),
            payload: {
                ...syncAction.getPayload(),
                PH_TOKEN: getUser(store.getState()).getToken()
            }
        });

        return Observable.fromPromise(SocketClient.sendAction(socketAction))
            .catch(error => Observable.of({error: error}))
            .map((response) => ({response, syncAction}));
    })
    .map(finishSync);


const defaultSyncCompleteHandler = {
    match: ({response, syncAction}) => false,
    success: ({response, syncAction}) => ({
        type: syncAction.getSuccessAction(),
        meta: syncAction.getMeta(),
        payload: response
    }),
    error: ({response, syncAction}) => ({
        type: syncAction.getErrorAction(),
        meta: syncAction.getMeta(),
        payload: response
    })
};

const syncCompleteHandlers = [];
export const addSyncCompleteHandler = (handler) => syncCompleteHandlers.push({...defaultSyncCompleteHandler, ...handler});

export const syncCompleteEpic = (action$, store) => action$
    .ofType(actionType.SYNC_FINISHED)
    .filter(action => syncCompleteHandlers.filter(handler => handler.match(action.meta)).length > 0)
    .mergeMap(action => {
        const matchingHandlers = syncCompleteHandlers.filter(handler => handler.match(action.meta));

        return action.meta.response.error
            ? matchingHandlers.map(handler => handler.error(action.meta))
            : matchingHandlers.map(handler => handler.success(action.meta));
    });
