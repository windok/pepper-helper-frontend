export default {
    onError: (error) => {
        // todo write error to state and sync with backend

        console.error('caught error', error);

        return true;
    }
};