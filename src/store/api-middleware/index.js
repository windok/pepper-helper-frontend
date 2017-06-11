import RestClient from './RestClient';
import {API_CALL} from './RSAA';

const isRSAA = (action) => {
    return action[API_CALL] !== undefined;
};

// todo make middleware immutable

const validateRSAA = (action) => {
    if (
        action[API_CALL].endpoint === undefined
        || action[API_CALL].endpoint.constructor.name !== 'String'
    ) {
        throw new Error('RSSA endpoint field is invalid.');
    }

    if (
        action[API_CALL].types === undefined
        || action[API_CALL].types.constructor.name !== 'Array'
        || action[API_CALL].types.length !== 3
    ) {
        throw new Error('RSSA types field is invalid.');
    }

    // todo add more validation

    return true;
};

const createActionForNext = (typeDescriptor, action, store, response) => {

    let resultActionBody = {};

    if (response !== undefined && response.data) {
        resultActionBody.payload = response.data;
    }

    if (typeof typeDescriptor !== 'object') {
        resultActionBody.type = typeDescriptor;

        return resultActionBody;
    }

    resultActionBody.type = typeDescriptor.type;

    // todo error handling if func payload or meta fail

    if (typeDescriptor.payload !== undefined) {
        resultActionBody.payload = typeof typeDescriptor.payload === 'function'
            ? typeDescriptor.payload(action, store.getState(), response)
            : typeDescriptor.payload;
    }

    if (typeDescriptor.meta !== undefined) {
        resultActionBody.meta = typeof typeDescriptor.meta === 'function'
            ? typeDescriptor.meta(action, store.getState(), response)
            : typeDescriptor.meta;
    }

    return resultActionBody;
};


const apiMiddleware = (store) => {
    return (next) => (action) => {

        if (!isRSAA(action)) {
            return next(action);
        }

        validateRSAA(action);

        const endpoint = action[API_CALL].endpoint;
        const [requestType, successType, failureType] = action[API_CALL].types;
        const method = action[API_CALL].method;
        const params = typeof action[API_CALL].params === 'function'
            ? action[API_CALL].params(action, store.getState())
            : action[API_CALL].params || {};

        const headers = {
            ...{
                'ph-token': 'test',
                'Content-Type': 'application/json',
                'Accept-Language': store.getState().storage.user.language,
            },
            ...(action[API_CALL].headers || {})
        };


        next(createActionForNext(requestType, action, store));

        return RestClient[method](endpoint, params, headers)
            .then(
                (response) => {
                    next(createActionForNext(successType, action, store, response))
                },
                (error) => {
                    // todo error payload and meta wrapping
                    next({
                        type: failureType,
                        error
                    })
                }
            );
    }
};

export {apiMiddleware};