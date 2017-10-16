import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {signIn} from 'Actions/auth';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';

import RegistrationScreen from './RegistrationScreen';

import {redirectToDefaultList} from 'Services/BrowserHistory';


class SignInScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            signUp: false
        };
    }

    render() {
        if (this.state.signUp) {
            return (<RegistrationScreen backToSignIn={() => {
                this.setState({signUp: false})
            }}/>);
        }
        return (
            <div>
                <form className="md-grid md-divider-border md-divider-border--bottom">
                    <TextField
                        id="email"
                        label="Email"
                        customSize="title"
                        required
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({email: value})}
                    />

                    <TextField
                        id="password"
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
                            onTouchTap={() => this.props.signIn(this.state.email, this.state.password)}
                            className="md-cell--right"
                        >Sign in</Button>
                    </div>
                </form>

                <div className="md-grid">
                    <div className="md-cell--center">
                        <div>
                            Want to join?
                        </div>
                        <Button
                            raised
                            secondary
                            onTouchTap={() => this.setState({signUp: true})}
                        >Sign up</Button>
                    </div>
                </div>

            </div>
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
)(SignInScreen);
