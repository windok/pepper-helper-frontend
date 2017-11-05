import uuid from 'uuid';
import moment from 'moment';
import {Observable} from "rxjs/Observable";

import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';
import {SOCKET_CALL} from "Store/socket-middleware/index";

import SyncAction from "Models/SyncAction";
import SocketAction from 'Models/SocketAction';

import {isOnline, isBackendConnected} from 'Reducers/app';
import {getProcessingAction, isQueueEmpty, isSyncInProgress, isColdStartFinished, getLastDiff} from 'Reducers/sync';
import {getUser} from 'Reducers/user'

export const createSyncAction = (syncAction) => ({
    type: actionType.SYNC_ACTION_CREATE,
    payload: syncAction
});

export const startSync = () => ({
    type: actionType.SYNC_START
});

export const cancelSync = () => ({
    type: actionType.SYNC_CANCEL
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
    .filter(() => {
        const state = store.getState();

        return isOnline(state)
            && isBackendConnected(state)
            && !isQueueEmpty(state)
            && !isSyncInProgress(state);
    })
    .do(() => console.log('start sync'))
    .map(startSync);

export const cancelSyncEpic = (action$, store) => action$
    .filter(() => {
        const state = store.getState();

        return (!isOnline(state) || !isBackendConnected(state)) && isSyncInProgress(state) && isColdStartFinished(state);
    })
    .do(() => console.log('cancel sync'))
    .map(cancelSync);

export const syncEpic = (action$, store) => action$
    .ofType(actionType.SYNC_START)
    .filter(() => {
        const state = store.getState();

        return isOnline(state) && isBackendConnected(state);
    })
    .do(() => console.log('start sync'))
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




export const requestDiffEpic = (action$, store) => action$
    .map(() => store.getState())
    .filter((state) => {
        return (
            isBackendConnected(state) && !isSyncInProgress(state) && isColdStartFinished(state)
            // at least 30 seconds after last sync past
            && moment.duration(moment().diff(getLastDiff(state))).asSeconds() >= 30
        );
    })
    .map((state) => {
        return {
            [SOCKET_CALL]: {
                action: 'diff',
                payload: {
                    timestamp: getLastDiff(state).unix(),
                    language: getUser(state).getLanguage()
                },
                types: [
                    actionType.SYNC_DIFF_REQUEST,
                    actionType.SYNC_DIFF_SUCCESS,
                    actionType.SYNC_DIFF_ERROR
                ],
            }
        }
    });

