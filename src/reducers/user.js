import * as actionType from 'Actions';
import User from 'Models/User';

const initialState = {
    model: null,
    refreshRequested: false
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.USER_REFRESH_REQUEST:
                return {...state, refreshRequested: true};

            case actionType.USER_REGISTER_SUCCESS:
            case actionType.USER_SIGN_IN_SUCCESS:
            case actionType.USER_REFRESH_SUCCESS:
                return {...state, model: action.payload, refreshRequested: false};

            case actionType.USER_REFRESH_ERROR:
                return {...state, refreshRequested: false};

            case 'userOld':
                return {...state, model: state.model.rrToken()};

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

export const getUser = (state) => state.user.model;

export const isUserRefreshRequested = (state) => state.user.refreshRequested;