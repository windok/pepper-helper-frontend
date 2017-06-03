import Axios from 'axios';
import Config from 'Config';
import store from 'Store';

const RestClient = Axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 10000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json',
        'Accept-Language': store.getState().storage.user.language,
    }
});

export default RestClient;
