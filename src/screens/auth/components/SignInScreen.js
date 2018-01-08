import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AutoFill from 'Lib/react-autofill';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';

import User from "Models/User";
import Toast from "Models/Toast";

import {getAuthErrorMessage, isAuthRequestSent} from "Reducers/auth";
import {getUser} from "Reducers/user";

import {addToast} from 'Actions/app';
import {redirectToDefaultList} from 'Services/BrowserHistory';
import {signIn} from 'Actions/auth';

class SignInScreen extends React.PureComponent {
    state = {
        email: '',
        password: ''
    };

    componentWillReceiveProps({user, errorMessage}) {
        user && redirectToDefaultList();
        errorMessage && this.props.errorMessage !== errorMessage && this.props.addToast(errorMessage);
    }

    login = () => {
        !this.props.isRequestSent && this.props.signIn(this.state.email, this.state.password);
    };

    render() {
        return (
            <form className="md-grid" onSubmit={(event) => {
                event.preventDefault();
                this.login();
            }}>
                <div className="md-cell md-cell--12">
                    <TextField
                        id="signIn-email"
                        name="email"
                        type="email"
                        label="Email"
                        required
                        onChange={(value) => this.setState({email: value})}
                    />

                    <TextField
                        id="signIn-password"
                        name="password"
                        type="password"
                        label="Password"
                        required
                        onChange={(value) => this.setState({password: value})}
                    />
                </div>

                <Button
                    raised
                    primary
                    type="submit"
                    className="md-cell md-cell--12"
                    disabled={this.props.isRequestSent}
                >Sign in</Button>
            </form>
        )

    }
}

SignInScreen.propTypes = {
    isRequestSent: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    user: PropTypes.instanceOf(User),

    signIn: PropTypes.func.isRequired,
    addToast: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        isRequestSent: isAuthRequestSent(state),
        errorMessage: getAuthErrorMessage(state),
        user: getUser(state)
    }),
    (dispatch) => ({
        signIn: (email, password) => dispatch(signIn(email, password)),
        addToast: (text) => dispatch(addToast(new Toast({id: 'login-toast', text, autohideTimeout: 4000})))
    })
)(AutoFill(SignInScreen));
