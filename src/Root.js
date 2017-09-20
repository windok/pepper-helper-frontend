import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Screen from 'Components/Screen';

const Root = ({store}) => (
    <Provider store={store}>
        <Screen/>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
