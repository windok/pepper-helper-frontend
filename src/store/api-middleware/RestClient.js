import {GET, POST, PUT, DELETE} from './RSAA';

import client from 'Services/RestClient';

export default {
    [GET]: (endpoint, params, headers) => {
        return client.get(endpoint, {params, headers});
    },
    [POST]: (endpoint, params, headers) => {
        return client.post(endpoint, params, {headers});
    },
    [PUT]: (endpoint, params, headers) => {
        return client.put(endpoint, params, {headers});
    },
    [DELETE]: (endpoint, params, headers) => {
        return client.delete(endpoint, {params, headers});
    }
};
