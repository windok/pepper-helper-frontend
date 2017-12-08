import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import User from 'Models/User';

import {getUser} from 'Reducers/user';
import {isRehydrationCompleted, isAppReady} from 'Reducers/app';

class Loader extends React.PureComponent {

    render() {
        if (this.props.isRehydrationCompleted && !this.props.user) {
            return this.props.auth;
        }

        if (this.props.isAppReady) {
            return this.props.ready;
        }

        return this.props.splash;
    }
}

Loader.propTypes = {
    ready: PropTypes.object.isRequired,
    splash: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.instanceOf(User),
    isAppReady: PropTypes.bool.isRequired,
    isRehydrationCompleted: PropTypes.bool.isRequired
};

export default connect(
    (state) => ({
        user: getUser(state),
        isAppReady: isAppReady(state),
        isRehydrationCompleted: isRehydrationCompleted(state),
    }),
)(Loader);