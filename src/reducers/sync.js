import moment from 'moment';

import * as actionType from 'Actions';
import SyncAction from 'Models/SyncAction';

const initialState = {
    actions: new Map(),
    queue: [],
    syncInProgress: false,
    resourcesLoaded: false,
    lastDiff: moment.unix(1),
    coldStartTime: moment.unix(1)
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.SYNC_ACTION_CREATE :
                return {
                    ...state,
                    actions: new Map([...state.actions]).set(action.payload.getId(), action.payload),
                    queue: state.queue.concat([action.payload.getId()])
                };

            case actionType.SYNC_START: {
                if (state.syncInProgress) {
                    return state;
                }

                return {
                    ...state,
                    syncInProgress: true
                };
            }

            case actionType.SYNC_CANCEL:
                return {
                    ...state,
                    syncInProgress: false
                };

            case actionType.SYNC_FINISHED: {

                if (!action.meta.syncAction) {
                    return {
                        ...state,
                        syncInProgress: false
                    }
                }

                if (!state.queue.length || state.queue[0] !== action.meta.syncAction.getId()) {
                    return state;
                }

                const actions = new Map([...state.actions]);
                actions.delete(state.queue[0]);

                return {
                    ...state,
                    actions,
                    queue: state.queue.slice(1, state.queue.length),
                    syncInProgress: false
                };
            }

            case actionType.SYNC_COLD_START_STARTED:
                if (state.syncInProgress) {
                    return state;
                }

                return {
                    ...state,
                    syncInProgress: true,
                    resourcesLoaded: false,
                    lastDiff: action.meta.time,
                };

            case actionType.SYNC_COLD_START_FINISHED:
                return {
                    ...state,
                    resourcesLoaded: true,
                    syncInProgress: false,
                    coldStartTime: action.meta.time
                };

            case actionType.SYNC_DIFF_REQUEST:
                return {
                    ...state,
                    syncInProgress: true
                };

            case actionType.SYNC_DIFF_SUCCESS:
                return {
                    ...state,
                    syncInProgress: false,
                    lastDiff: moment.utc()  // todo get from response
                };

            case actionType.SYNC_DIFF_ERROR:
                return {
                    ...state,
                    syncInProgress: false
                };

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            actions: Array.from(state.actions.entries(), ([actionId, action]) => [actionId, action.serialize()]),
            queue: state.queue,
            resourcesLoaded: state.resourcesLoaded,
            lastDiff: state.lastDiff.unix()
        }),
        rehydrate: (persistedState) => ({
            ...initialState,
            actions: new Map(persistedState.actions.map(([actionId, actionData]) => [actionId, new SyncAction(actionData)])),
            queue: persistedState.queue,
            resourcesLoaded: persistedState.resourcesLoaded,
            lastDiff: moment.unix(persistedState.lastDiff)
        })
    }
);

export const isQueueEmpty = (state) => !state.sync.queue.length;

export const isSyncInProgress = (state) => state.sync.syncInProgress;

export const getProcessingAction = (state) => state.sync.actions.get(state.sync.queue[0]);

export const isColdStartFinished = (state) => state.sync.resourcesLoaded;

export const getLastDiff = (state) => state.sync.lastDiff;