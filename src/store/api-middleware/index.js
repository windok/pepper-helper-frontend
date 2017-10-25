import RestClient from './RestClient';
import {API_CALL} from './RSAA';
import ErrorHandler from 'Services/ErrorHandler';

// todo refactor setting token
import {getUser} from 'Reducers/user';


const isRSAA = (action) => {
    return action && action.hasOwnProperty(API_CALL);
};

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
        const payload = typeof action[API_CALL].payload === 'function'
            ? action[API_CALL].payload(action, store.getState())
            : action[API_CALL].payload || {};


        let headers = {};

        // todo refactor user specific headers
        const user = getUser(store.getState());

        if (user) {
            headers['PH-TOKEN'] = user.getToken();
            headers['Accept-Language'] = user.getLanguage();
        }

        headers = {
            ...headers,
            ...(action[API_CALL].headers || {})
        };

        next(createActionForNext(requestType, action, store));

        return RestClient[method](endpoint, payload, headers)
            .then(
                (response) => {
                    const actionForNext = createActionForNext(successType, action, store, response);

                    next(actionForNext);

                    return Promise.resolve(actionForNext.payload);
                },
                (error) => {
                    // todo error payload and meta wrapping
                    const actionForNext = {
                        type: failureType,
                        error
                    };

                    next(actionForNext);

                    return Promise.reject(actionForNext.error);
                }
            )
            .catch(e => ErrorHandler.handle(e));
    }
};

export {apiMiddleware};