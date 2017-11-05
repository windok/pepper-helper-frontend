import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AutoFill from 'Lib/react-autofill';

import {signIn} from 'Actions/auth';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';

import {redirectToDefaultList} from 'Services/BrowserHistory';


class SignInScreen extends React.PureComponent {
    state = {
        email: '',
        password: ''
    };

    render() {
        return (
                <form className="md-grid md-divider-border md-divider-border--bottom">
                    <TextField
                        id="signIn-email"
                        name="email"
                        type="email"
                        label="Email"
                        customSize="title"
                        required
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({email: value})}
                    />

                    <TextField
                        id="signIn-password"
                        name="password"
                        type="password"
                        label="Password"
                        customSize="title"
                        required
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({password: value})}
                    />

                    <div className="md-grid">
                        <Button
                            raised
                            onClick={() => this.props.signIn(this.state.email, this.state.password)}
                            className="md-cell--right"
                        >Sign in</Button>
                    </div>
                </form>
        )

    }
}

SignInScreen.propTypes = {
    signIn: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch) => {
        return {
            signIn: (email, password) => {
                signIn(email, password)(dispatch);
                redirectToDefaultList();
            }
        };
    }
)(AutoFill(SignInScreen));
