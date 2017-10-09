import uuid from 'uuid/v4';
import SocketClient from 'Services/SocketClient';
import SocketRequest from 'Models/SocketRequest';
import SyncAction from 'Models/SyncAction';

import ErrorHandler from 'Services/ErrorHandler';
import UnauthorizedError from 'Errors/UnauthorizedError';

// todo refactor:
import {getUser} from 'Reducers/user';


export const SOCKET_CALL = Symbol('Call Pepper Helper Socket API action');

const isSocketRSAA = (action) => {
    return action && action.hasOwnProperty(SOCKET_CALL);
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

        const user = getUser(store.getState());

        const syncAction = new SyncAction({
            id: uuid(),
            name: socketAction,
            payload: {
                ...payload,
                PH_TOKEN: user.getToken()
            }
        });

        return SocketClient.sendAction(syncAction).then(
            (response) => {
                const actionForNext = createActionForNext(successType, action, store, response);
                next(actionForNext);

                return Promise.resolve(actionForNext.payload);
            },
            (error) => {
                if (error === "Authorization error: User that you reference is not authorized!") {
                    throw new UnauthorizedError();
                }

                const actionForNext = createActionForNext(failureType, action, store, error);
                next(actionForNext);

                return Promise.reject(actionForNext.payload);
            }
        ).catch(e => ErrorHandler.handle(e));
    }
};

export {socketMiddleware};