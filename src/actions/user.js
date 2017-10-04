import * as actionType from 'Actions';
import {API_CALL, POST, PUT} from 'Store/api-middleware/RSAA';
import User from 'Models/User';

export const register = (user) => (dispatch) => {
    user.avatar = user.avatar || 'imgUrl';

    if (!user.name) {
        delete user.name;
    }

    return dispatch({
        [API_CALL]: {
            endpoint: '/user/register',
            method: POST,
            params: {
                ...user
            },
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
            params: {email, password},
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

export const logout = () => (dispatch) => {
    return dispatch({
        type: actionType.USER_LOGOUT
    });
};