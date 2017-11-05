import * as actionType from 'Actions';
import {API_CALL, POST, PUT} from 'Store/api-middleware/RSAA';

import SocketClient from 'Services/SocketClient';

import User from 'Models/User';

import {getApplicationVersion, getCacheApplicationVersion} from 'Reducers/app'
import {isTokenExpired} from 'Reducers/user'

export const register = (user) => (dispatch) => {
    user.avatar = user.avatar || 'imgUrl';

    if (!user.name) {
        delete user.name;
    }

    return dispatch({
        [API_CALL]: {
            endpoint: '/user/register',
            method: POST,
            payload: user,
            headers: {
                'Accept-Language': user.language
            },
            types: [
                actionType.USER_REGISTER_REQUEST,
                {
                    type: actionType.USER_REGISTER_SUCCESS,
                    payload: (action, state, response) => new User({
                        ...response.data,
                        name: response.data.name || '',
                        avatar: response.data.avatar || '',
                        language: response.data.language || 'en'
                    })
                },
                actionType.USER_REGISTER_ERROR
            ],
        }
    });
};

export const signIn = (email, password) => (dispatch) => {
    return dispatch({
        [API_CALL]: {
            endpoint: '/user/signIn',
            method: PUT,
            payload: {email, password},
            types: [
                actionType.USER_SIGN_IN_REQUEST,
                {
                    type: actionType.USER_SIGN_IN_SUCCESS,
                    payload: (action, state, response) => new User({
                        ...response.data,
                        name: response.data.name || '',
                        avatar: response.data.avatar || '',
                        language: response.data.language || 'en'
                    })
                },
                actionType.USER_SIGN_IN_ERROR
            ],
        }
    });
};

export const logout = () => {
    SocketClient.close();

    return {type: actionType.USER_LOGOUT};
};

export const logoutEpic = (action$, store) => action$
    .map(() => store.getState())
    .filter(
        (state) => isTokenExpired(state)
        || getApplicationVersion(state) !== getCacheApplicationVersion(state)  // todo get rid of temporal hack
    )
    .do(() => console.log('logout'))
    .map(logout);