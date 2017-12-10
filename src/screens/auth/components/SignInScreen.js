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
            <form className="md-grid" onSubmit={(event) => {
                event.preventDefault();
                this.props.signIn(this.state.email, this.state.password);
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
                >Sign in</Button>
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
                dispatch(signIn(email, password));
                redirectToDefaultList();
            }
        };
    }
)(AutoFill(SignInScreen));
