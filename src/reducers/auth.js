import * as actionType from 'Actions';

const initialState = {
    requestSent: false,
    errorMessage: ''
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.USER_SIGN_IN_REQUEST:
            case actionType.USER_REGISTER_REQUEST:
                return {...initialState, requestSent: true, errorMessage: ''};

            case actionType.USER_SIGN_IN_SUCCESS:
            case actionType.USER_REGISTER_SUCCESS:
                return {...initialState, requestSent: false, errorMessage: ''};

            case actionType.USER_SIGN_IN_ERROR:
            case actionType.USER_REGISTER_ERROR:
                return {...initialState, requestSent: false, errorMessage: action.payload};
        }

        return state;
    },
    {
        persist: () => {},
        rehydrate: () => initialState
    });

export const isAuthRequestSent = state => state.auth.requestSent;
export const getAuthErrorMessage = state => state.auth.errorMessage;