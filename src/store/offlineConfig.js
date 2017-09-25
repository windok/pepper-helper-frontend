import {createTransform} from 'redux-persist';
import offlineDefaultConfig from 'redux-offline/lib/defaults';

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

import uuid from 'uuid/v4';
import SocketClient from 'Services/SocketClient';
import SocketRequest from 'Models/SocketRequest';
import SyncAction from 'Models/SyncAction';

export default () => {
    return {
        ...offlineDefaultConfig,
        effect: (effect, action) => {
            // console.log('effect', effect);
            // console.log('action', action);

            const actionId = uuid();
            const syncAction = new SyncAction({
                id: actionId,
                name: effect.action,
                payload: effect.payload || {}
            });

            const socketRequest = new SocketRequest({
                id: uuid(),
                actions: [syncAction]
            });

            return SocketClient.send(socketRequest)
                .then(socketResponse => {
                    let actionResponse = socketResponse.getAction(actionId);

                    if (action.meta.offline.commit && action.meta.offline.commit.payload) {
                        actionResponse = action.meta.offline.commit.payload(actionResponse);
                    }

                    return actionResponse;
                });
        },
        persistOptions: {
            transforms: [storeTransform],
        }
    };
}
