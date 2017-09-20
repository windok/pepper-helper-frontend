import * as actionType from 'Actions';

const initialState = {
    rehydrateCompleted: false
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.OFFLINE_REHYDRATE_COMPLETED:
                return {...state, rehydrateCompleted: true};
        }

        return state;
    },
    {
        persist: () => {
            return {};
        }
    });

export const isRehydrationCompleted = (state) => {
    return state.app.rehydrateCompleted
};
