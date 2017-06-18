import * as actionType from 'Actions';

export const showMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SHOW_SIDEBAR
    });
};

export const hideMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_HIDE_SIDEBAR
    });
};

export const toggleMenu = () => (dispatch) => {
    dispatch({
        type: actionType.UI_TOGGLE_SIDEBAR
    });
};

