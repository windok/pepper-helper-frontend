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

export const enableListManagerMode = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SIDEBAR_LIST_MANAGER_MODE,
        payload: true
    });
};

export const disableListManagerMode = () => (dispatch) => {
    dispatch({
        type: actionType.UI_SIDEBAR_LIST_MANAGER_MODE,
        payload: false
    });
};
