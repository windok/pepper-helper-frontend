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
        }

        return state;
    }
);

export const isSidebarOpened = (state) => {
    return state.ui.sidebar.isOpened;
};
