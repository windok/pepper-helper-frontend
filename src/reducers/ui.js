import * as actionType from 'Actions';

const initialState = {
    sidebar: {
        isOpened: false
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UI_SHOW_SIDEBAR :
            return {...state, sidebar: {...state.sidebar, isOpened: true}};
        case actionType.UI_HIDE_SIDEBAR :
            return {...state, sidebar: {...state.sidebar, isOpened: false}};
        case actionType.UI_TOGGLE_SIDEBAR :
            return {...state, sidebar: {...state.sidebar, isOpened: !state.sidebar.isOpened}};
    }

    return state;
};