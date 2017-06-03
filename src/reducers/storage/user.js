
const initialState = {
    language: (navigator.language || navigator.userLanguage).split('-')[0]
};

export default (state = initialState, action) => {
    return state;
};