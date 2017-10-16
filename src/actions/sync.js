import uuid from 'uuid';
import {Observable} from "rxjs/Observable";

import * as actionType from 'Actions';

import SocketClient from 'Services/SocketClient';

import SyncAction from "Models/SyncAction";
import SocketAction from 'Models/SocketAction';

import {getProcessingAction, isQueueEmpty, isSyncInProgress} from 'Reducers/sync';
import {getUser} from 'Reducers/user'

export const createSyncAction = (name, payload, responseAction) => {
    const syncAction = new SyncAction({
        id: uuid(),
        name,
        payload,
        responseAction
    });

    return {
        type: actionType.SYNC_ACTION_CREATE,
        payload: syncAction
    };
};

export const startSync = () => ({
    type: actionType.SYNC_START
});

export const finishSync = () => ({
    type: actionType.SYNC_FINISHED
});

export const createSyncActionEpic = (action$, store) => action$
    .filter((action) => !!action.sync && !!action.sync.name)
    .map((action) => createSyncAction(
        action.sync.name,
        {...(action.sync.payload || action.payload.serialize() || {})},
        action.sync.responseAction
    ));


export const startSyncEpic = (action$, store) => action$
    .filter(() => !isQueueEmpty(store.getState()) && !isSyncInProgress(store.getState()))
    .do(() => console.log('start sync'))
    .map(startSync);


export const syncEpic = (action$, store) => action$
    .ofType(actionType.SYNC_START)
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
    .do(({response, syncAction}) => {
        // todo get rid of this action, e.g. pass this data in finishSync action and then listen for that action event
        if (!syncAction.getResponseAction()) return;

        store.dispatch({
            type: syncAction.getResponseAction(),
            payload: response,
            meta: {syncAction}
        })
    })
    .map(finishSync);