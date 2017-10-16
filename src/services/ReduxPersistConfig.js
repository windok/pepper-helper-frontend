import {createTransform} from 'redux-persist';

import {transformers} from 'Reducers';

const storeTransform = createTransform(
    // transform state coming from redux on its way to being serialized and stored
    (inboundState, key) => {
        if (!transformers.hasOwnProperty(key) || !transformers[key].hasOwnProperty('persist')) {
            return inboundState;
        }

        return transformers[key].persist(inboundState);

    },
    // transform state coming from storage, on its way to be rehydrated into redux
    (outboundState, key) => {
        if (!transformers.hasOwnProperty(key) || !transformers[key].hasOwnProperty('rehydrate')) {
            return outboundState;
        }

        return transformers[key].rehydrate(outboundState);
    }
);

export default {
    transforms: [storeTransform],
    debounce: 10000
};
