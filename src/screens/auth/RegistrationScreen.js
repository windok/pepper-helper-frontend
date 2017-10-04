import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import {register} from 'Actions/user';

import {getAvailableLanguages} from 'Reducers/app';
import {redirectToDefaultList} from 'Services/BrowserHistory';


class RegistrationScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            language: props.preferredLanguage,
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
            language: this.state.language
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

                    <SelectField
                        id="language"
                        label="Language"
                        className="md-cell md-cell--12"
                        defaultValue={this.state.language}
                        menuItems={this.props.languages}
                        onChange={(value) => this.setState({language: value})}/>

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
    languages: PropTypes.array.isRequired,
    preferredLanguage: PropTypes.string.isRequired,
    backToSignIn: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
};

export default connect(
    (state) => {

        const languages = getAvailableLanguages(state);
        const browserLanguages = (navigator.language || navigator.userLanguage).split(',');

        const preferredLanguages = browserLanguages.filter(language => languages.includes(language.split('-')));

        return {
            languages,
            preferredLanguage: preferredLanguages.length ? preferredLanguages[0] : languages[0]
        }
    },
    (dispatch) => {
        return {
            register: (userData) => {
                register(userData)(dispatch);
                redirectToDefaultList();
            }
        };
    }
)(RegistrationScreen);
