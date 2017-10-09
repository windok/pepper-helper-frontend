import store from 'Store';
import {logout} from 'actions/user';
import UnauthorizedError from 'Errors/UnauthorizedError';

export default {
    onError: (error) => {

        if (error instanceof UnauthorizedError) {
            logout()(store.dispatch);
        }

        return true;
    }
};