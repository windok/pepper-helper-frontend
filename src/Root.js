import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Screen from 'Components/Screen';
import AuthScreen from 'Screens/Auth/AuthScreen';

const Root = ({store}) => (
    <Provider store={store}>
        <AuthScreen>
            <Screen/>
        </AuthScreen>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
