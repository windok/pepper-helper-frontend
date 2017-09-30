import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getUser} from 'Reducers/user';
import User from 'Models/User';

import SignInScreen from './SignInScreen';

class AuthScreen extends React.PureComponent {
    render() {
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
};

export default connect(
    (state) => {
        return {
            user: getUser(state)
        };
    },
    (dispatch) => {
        return {};
    }
)(AuthScreen);
