import * as actionType from 'Actions';

export const showMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SIDEBAR_SHOW
    });
};

export const hideMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SIDEBAR_HIDE
    });
};

export const toggleMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SIDEBAR_TOGGLE
    });
};
