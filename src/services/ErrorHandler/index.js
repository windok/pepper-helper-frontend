const handlers = [];

const addHandler = (handler) => {
    handlers.push(handler);
};

const addHandlers = (handlers) => {
    handlers.forEach(handler => addHandler(handler));
};

const handle = (error) => {
    for (let i = 0, l = handlers.length; i < l; i++) {
        if (!handlers[i].onError(error)) break;
    }
};

export default {
    addHandler,
    addHandlers,
    handle
};