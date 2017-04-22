import Axios from 'axios';

// todo move host name to application or module config, create application config
// todo move to some service registry
const RestClient = Axios.create({
    baseURL: 'http://localhost:30005'
});

export default RestClient;
