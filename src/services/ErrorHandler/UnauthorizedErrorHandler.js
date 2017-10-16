import store from 'Store';
import {logout} from 'actions/auth';
import UnauthorizedError from 'Errors/UnauthorizedError';

export default {
    onError: (error) => {

        if (error instanceof UnauthorizedError) {
            store.dispatch(logout());
        }

        return true;
    }
};
