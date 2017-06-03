import Axios from 'axios';
import Config from 'Config';

const language = (navigator.language || navigator.userLanguage).split('-')[0];

const RestClient = Axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 10000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json',
        'Accept-Language': language,
    }
});

export default RestClient;
