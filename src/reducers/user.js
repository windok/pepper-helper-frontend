import Moment from 'moment';

import * as actionType from 'Actions';
import User from 'Models/User';

const initialState = {
    model: null
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.USER_REGISTER_SUCCESS:
            case actionType.USER_SIGN_IN_SUCCESS:
                return {...state, model: action.payload};

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            model: state.model ? state.model.serialize() : null
        }),
        rehydrate: (savedState) => ({
            model: savedState.model && new User(savedState.model)
        })
    });

export const getUserLanguage = (state) => {
    return state.user.model.getLanguage();
};

export const getUser = (state) => {
    return state.user.model;
};

export const isTokenExpired = state => {
    const user = state.user.model;

    if (!user) {
        return false;
    }

    return Moment.utc().isAfter(user.getTokenLifeTime())
};