import Axios from 'axios';
import Config from 'Config';

const RestClient = Axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 10000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json'
    }
});

export default RestClient;
