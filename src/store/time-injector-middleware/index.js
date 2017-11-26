import moment from 'moment';

export const timeInjectorMiddleware = (store) => {
    return (next) => (action) => {
        action.meta = action.meta || {};
        action.meta.time = action.meta.time || moment.utc();

        return next(action);
    }
};