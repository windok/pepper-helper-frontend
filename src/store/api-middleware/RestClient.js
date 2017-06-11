import Axios from 'axios';
import Config from 'Config';
import {GET, POST, PUT, DELETE} from './RSAA';

const apiTransport = Axios.create({
    baseURL: Config.BACKEND_URL,
    timeout: 10000,
});

export default {
    [GET]: (endpoint, params, headers) => {
        return apiTransport.get(endpoint, {params, headers});
    },
    [POST]: (endpoint, params, headers) => {
        return apiTransport.post(endpoint, params, {headers});
    },
    [PUT]: (endpoint, params, headers) => {
        return apiTransport.put(endpoint, params, {headers});
    },
    [DELETE]: (endpoint, params, headers) => {
        return apiTransport.delete(endpoint, {params, headers});
    }
};
