import config from 'Config';

import uuid from 'uuid/v4';
import SocketRequest from 'Models/SocketRequest';
import SocketResponse from 'Models/SocketResponse';

let connectionPromise = null;
let socket = null;

const initialReconnectTimeout = 50;
const maxReconnectTimeout = 10 * 60 * 1000;
let reconnectTimeout = initialReconnectTimeout;

const requests = new Map();

const isConnected = () => Boolean(socket) && socket.readyState === WebSocket.OPEN;

const connect = () => {
    if (connectionPromise) {
        return connectionPromise;
    }

    if (socket) {
        return Promise.resolve(socket);
    }

    connectionPromise = new Promise((resolve, reject) => {
        socket = new WebSocket(config.BACKEND_WS_URL);

        socket.onopen = function () {
            connectionPromise = null;
            reconnectTimeout = initialReconnectTimeout;
            resolve(socket);

            console.log("Connected");
        };

        socket.onclose = function (event) {
            console.log('Connection closed', event);

            connectionPromise = null;
            socket = null;

            reconnectTimeout *= 2;
            if (reconnectTimeout > maxReconnectTimeout) {
                reconnectTimeout = maxReconnectTimeout;
            }

            setTimeout(connect, reconnectTimeout);
        };

        socket.onmessage = function (event) {
            // console.log('onmessage', event);

            if (event.data) {
                const response = JSON.parse(event.data);

                if (requests.has(response.requestId)) {
                    console.log('decoded response', requests.get(response.requestId).request.getActions()[0].getName(), response);

                    requests.get(response.requestId).resolve(new SocketResponse({
                        id: response.requestId,
                        actions: response.actions
                    }));
                    requests.delete(response.requestId);
                }
            }
        };

        socket.onerror = function (error) {
            console.log('onerror', error);
        };
    });

    return connectionPromise;
};

const send = (request, retryCount = 0) => connect()
    .then((socket) => {
        // todo wait to send after reconnect when socket is closing state

        console.log('send request', request.getActions()[0].getName(), request);

        let requestMeta = requests.get(request.getId());

        if (!requestMeta) {
            requestMeta = {request, resolve: Promise.resolve(), reject: Promise.reject, retryCount: 0};
            requests.set(request.getId(), requestMeta);
        } else {
            requestMeta.retryCount++;
        }

        // some instabilities may occur, but socket client tries to reconnect automatically
        if (requestMeta.retryCount > 5) {
            return Promise.reject('Can not send socket request.');
        }

        if (!isConnected()) {
            return new Promise(resolve => setTimeout(resolve, 100)).then(() => send(request));
        }

        return new Promise((resolve, reject) => {
            requestMeta.resolve = resolve;
            requestMeta.reject = reject;

            setTimeout(() => {
                requests.delete(request.getId());
                reject('Socket response timeout');
            }, request.getTimeout());

            socket.send(request.toJSON());
        })
});

const sendAction = (action) => {
    return send(new SocketRequest({
        id: uuid(),
        actions: [action]
    })).then(
        (response) => {
            const socketActionResponse = response.getAction(action.getId());

            if (socketActionResponse.error) {
                return Promise.reject(socketActionResponse.error);
            }

            return Promise.resolve(socketActionResponse);
        }
    );
};

const SocketClient = {
    connect,
    send,
    sendAction,
    isConnected
};

export default SocketClient;
