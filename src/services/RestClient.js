import Axios from 'axios';
import Config from 'Config';

const apiTransport = Axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default apiTransport;
