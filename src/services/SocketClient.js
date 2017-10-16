import config from 'Config';

import uuid from 'uuid/v4';
import SocketRequest from 'Models/SocketRequest';
import SocketResponse from 'Models/SocketResponse';

let connectionPromise = null;
let socket = null;

const requests = new Map();

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
            resolve(socket);

            console.log("Connected");
        };

        socket.onclose = function (event) {
            console.log('Connection closed', event);

            connectionPromise = null;
            socket = null;

            setTimeout(connect, 1000);
        };

        socket.onmessage = function (event) {
            console.log('onmessage', event);

            if (event.data) {
                const response = JSON.parse(event.data);
                console.log('decoded response', response);

                if (requests.has(response.requestId)) {
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

const send = (request) => connect()
    .then((socket) => {
        // todo wait to send after reconnect when socket is closing state

        console.log('send request', request);

        return new Promise((resolve, reject) => {
            requests.set(request.getId(), {request, resolve, reject});

            setTimeout(() => {
                requests.delete(request.getId());
                reject('Socket response timeout');
            }, request.getTimeout());

            socket.send(request.toJSON());
        });
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
    sendAction
};

export default SocketClient;
