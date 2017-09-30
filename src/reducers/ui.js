import * as actionType from 'Actions';

const initialState = {
    sidebar: {
        isOpened: false
    }
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.UI_SIDEBAR_SHOW :
                return {...state, sidebar: {...state.sidebar, isOpened: true}};
            case actionType.UI_SIDEBAR_HIDE :
                return {...state, sidebar: {...state.sidebar, isOpened: false}};
            case actionType.UI_SIDEBAR_TOGGLE :
                return {...state, sidebar: {...state.sidebar, isOpened: !state.sidebar.isOpened}};

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    }
);

export const isSidebarOpened = (state) => {
    return state.ui.sidebar.isOpened;
};
