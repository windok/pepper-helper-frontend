import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import User from 'Models/User';

import {getUser} from 'Reducers/user';
import {isRehydrationCompleted} from 'Reducers/app';

class Loader extends React.PureComponent {

    render() {

        let state = 'splash';

        if (this.props.isRehydrationCompleted) {
            state = 'auth';

            if (this.props.user) {
                state = 'ready';
            }
        }

        return this.props[state];
    }
}

Loader.propTypes = {
    ready: PropTypes.object.isRequired,
    splash: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.instanceOf(User),
    isRehydrationCompleted: PropTypes.bool.isRequired,
};

export default connect(
    (state) => {
        return {
            isRehydrationCompleted: isRehydrationCompleted(state),
            user: getUser(state),
        };
    },
)(Loader);