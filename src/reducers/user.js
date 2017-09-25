const initialState = {
    language: (navigator.language || navigator.userLanguage).split('-')[0]
};

export default Object.assign(
    (state = initialState, action) => {
        return state;
    },
    {
        persist: () => {
            return {};
        }
    });

export const getUserLanguage = (state) => {
    return state.user.language
};