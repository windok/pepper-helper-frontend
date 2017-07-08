import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

const redirectToDefaultList = () => history.push('/');

export default history;
export {history, redirectToDefaultList}