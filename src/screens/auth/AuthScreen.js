import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import User from 'Models/User';

import {getUser} from 'Reducers/user';
import {isRehydrationCompleted} from 'Reducers/app';

import SignInScreen from './components/SignInScreen';

class AuthScreen extends React.PureComponent {
    render() {
        if (!this.props.isRehydrationCompleted) return (<CircularProgress id="progressBar"/>);

        return (
            <div>
                {!this.props.user && (<SignInScreen/>)}
                {this.props.user && (this.props.children)}
            </div>
        )
    }
}

AuthScreen.propTypes = {
    children: PropTypes.object.isRequired,
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
)(AuthScreen);
