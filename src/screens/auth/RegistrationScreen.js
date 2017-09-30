import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';

import {register} from 'Actions/user';


class RegistrationScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            errors: []
        };
    }

    register() {
        // todo make validation as onChange event handler for each field
        const errors = [];
        if (!/\S+@\S+\.\S+/.test(this.state.email)) {
            errors.push('Email field is not valid.')
        }
        if (!/[0-9]/.test(this.state.password)) {
            errors.push('Password field should contain at least one digit.')
        }
        if (!/[a-zA-Z]/.test(this.state.password)) {
            errors.push('Password field should contain at least one letter.')
        }
        if (!/[^a-zA-Z\d]/.test(this.state.password)) {
            errors.push('Password field should contain at least one special symbol.')
        }

        this.setState({errors});

        if (errors.length && true) {
            return;
        }

        const user = {
            email: this.state.email,
            password: this.state.password,
        };

        if (this.state.name) {
            user.name = this.state.name
        }

        this.props.register(user);
    }

    render() {
        return (
            <div>
                <div className="md-grid md-divider-border md-divider-border--bottom">
                    <div className="md-cell--center">
                        <div>
                            Already have account?
                        </div>
                        <Button
                            raised
                            secondary
                            onTouchTap={this.props.backToSignIn}
                        >Sign in</Button>
                    </div>
                </div>


                <form className="md-grid">
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

                    <TextField
                        id="name"
                        label="Name"
                        customSize="title"
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({name: value})}
                    />

                    <Button
                        raised
                        onTouchTap={this.register.bind(this)}
                        className="md-cell--center"
                    >Create account</Button>

                    <div>
                        {this.state.errors.map((errorMessage, key) => (<div key={key}>{errorMessage}</div>))}
                    </div>
                </form>

            </div>
        )
    }
}

RegistrationScreen.propTypes = {
    backToSignIn: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch) => {
        return {
            register: (userData) => register(userData)(dispatch)
        };
    }
)(RegistrationScreen);
