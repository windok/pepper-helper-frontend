export const STATE_PROVIDER = Symbol('State provider for actions');

const stateProviderMiddleware = (store) => {
    return (next) => (action) => {

        if (!(action.hasOwnProperty(STATE_PROVIDER) && typeof action[STATE_PROVIDER] === 'function')) {
            return next(action)
        }

        return next(action[STATE_PROVIDER](store.getState()));
    }
};

export default stateProviderMiddleware;