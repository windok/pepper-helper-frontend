import uuid from 'uuid/v4';
import SocketClient from 'Services/SocketClient';
import SocketRequest from 'Models/SocketRequest';
import SyncAction from 'Models/SyncAction';


export const SOCKET_CALL = Symbol('Call Pepper Helper Socket API action');

const isSocketRSAA = (action) => {
    return action[SOCKET_CALL] !== undefined;
};

const validateRSAA = (action) => {
    if (action[SOCKET_CALL].action === undefined || typeof action[SOCKET_CALL].action !== 'string') {
        throw new Error('RSSA action field is invalid.');
    }

    if (
        action[SOCKET_CALL].types === undefined
        || !action[SOCKET_CALL].types instanceof Array
        || action[SOCKET_CALL].types.length !== 3
    ) {
        throw new Error('RSSA types field is invalid.');
    }

    // todo add more validation

    return true;
};

const createActionForNext = (typeDescriptor, action, store, response) => {

    if (typeof typeDescriptor === 'string') {
        return {type: typeDescriptor};
    }

    // todo error handling if func payload or meta fail
    return {
        type: typeDescriptor.type,
        meta: typeof typeDescriptor.meta === 'function'
            ? typeDescriptor.meta(action, store.getState(), response)
            : typeDescriptor.meta || {},
        payload: typeof typeDescriptor.payload === 'function'
            ? typeDescriptor.payload(action, store.getState(), response)
            : response || typeDescriptor.payload || {}
    };
};


const socketMiddleware = (store) => {
    return (next) => (action) => {
        try {

            if (!isSocketRSAA(action)) {
                return next(action);
            }

            validateRSAA(action);

            const socketAction = action[SOCKET_CALL].action;
            const [requestType, successType, failureType] = action[SOCKET_CALL].types;
            const payload = typeof action[SOCKET_CALL].payload === 'function'
                ? action[SOCKET_CALL].payload(action, store.getState())
                : action[SOCKET_CALL].payload || {};

            next(createActionForNext(requestType, action, store));

            const actionId = uuid();
            const syncAction = new SyncAction({
                id: actionId,
                name: socketAction,
                payload
            });

            return SocketClient.send(new SocketRequest({
                id: uuid(),
                actions: [syncAction]
            })).then(
                (response) => {
                    const socketActionResponse = response.getAction(actionId);

                    const actionForNext = createActionForNext(successType, action, store, socketActionResponse);
                    next(actionForNext);

                    return Promise.resolve(actionForNext.payload);
                },
                (error) => {
                    const actionForNext = createActionForNext(failureType, action, store, error);
                    next(actionForNext);

                    return Promise.reject(actionForNext.payload);
                }
            );

        } catch (e) {
            console.error(e);
        }
    }
};

export {socketMiddleware};