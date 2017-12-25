import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

import GlobalSnackbar from 'Components/Snackbar';
import Loader from 'Components/Loader';
import Splash from 'Components/Splash';
import Router from 'Components/Router';
import AuthScreen from 'Screens/auth/AuthScreen';

const Root = ({store}) => (
    <Provider store={store}>
        <GlobalSnackbar>
            <Loader ready={<Router/>} splash={<Splash/>} auth={<AuthScreen/>} />
        </GlobalSnackbar>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
