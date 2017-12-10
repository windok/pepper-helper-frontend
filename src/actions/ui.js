import * as actionType from 'Actions';

export const showMenu = () => ({
    type: actionType.UI_SIDEBAR_SHOW
});

export const hideMenu = () => ({
    type: actionType.UI_SIDEBAR_HIDE
});
