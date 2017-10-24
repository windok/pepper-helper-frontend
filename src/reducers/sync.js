import * as actionType from 'Actions';
import SyncAction from 'Models/SyncAction';

const initialState = {
    actions: new Map(),
    queue: [],
    syncInProgress: false
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
            case actionType.SYNC_FINISHED: {

                const actions = new Map([...state.actions]);
                actions.delete(state.queue[0]);

                return {
                    ...state,
                    actions,
                    queue: state.queue.slice(1, state.queue.length),
                    syncInProgress: false
                };
            }
        }

        return state;
    },
    {
        persist: (state) => ({
            actions: Array.from(state.actions.entries(), ([actionId, action]) => [actionId, action.serialize()]),
            queue: state.queue
        }),
        rehydrate: (persistedState) => ({
            ...initialState,
            actions: new Map(persistedState.actions.map(([actionId, actionData]) => [actionId, new SyncAction(actionData)])),
            queue: persistedState.queue
        })
    }
);

export const isQueueEmpty = (state) => {
    return !state.sync.queue.length;
};

export const isSyncInProgress = (state) => {
    return state.sync.syncInProgress;
};

export const getProcessingAction = (state) => {
    return state.sync.actions.get(state.sync.queue[0]);
};