import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import User from 'Models/User';

import {getUser} from 'Reducers/user';
import {isRehydrationCompleted} from 'Reducers/app';

import SignInScreen from './components/SignInScreen';
import RegistrationScreen from './components/RegistrationScreen';
import Button from 'react-md/lib/Buttons';

class AuthScreen extends React.PureComponent {

    state = {
        screen: 'signIn'
    };

    render() {
        if (!this.props.isRehydrationCompleted) return (<CircularProgress id="progressBar"/>);

        const screens = {
            signIn: (
                <div>
                    <SignInScreen/>
                    <div className="md-grid">
                        <div className="md-cell--center">
                            <div>
                                Want to join?
                            </div>
                            <Button
                                raised
                                secondary
                                onClick={() => this.setState({screen: 'registration'})}
                            >Sign up</Button>
                        </div>
                    </div>
                </div>
            ),
            registration: (
                <div>
                    <div className="md-grid md-divider-border md-divider-border--bottom">
                        <div className="md-cell--center">
                            <div>
                                Already have account?
                            </div>
                            <Button
                                raised
                                secondary
                                onClick={() => this.setState({screen: 'signIn'})}
                            >Sign in</Button>
                        </div>
                    </div>
                    <RegistrationScreen/>
                </div>
            )
        };

        return (
            <div>
                {!this.props.user && screens[this.state.screen]}
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
