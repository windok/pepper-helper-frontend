import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AutoFill from 'Lib/react-autofill';

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import {register} from 'Actions/auth';

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
            <form className="md-grid">
                <TextField
                    name="email"
                    label="Email"
                    customSize="title"
                    required
                    className="md-cell md-cell--12"
                    onChange={(value) => this.setState({email: value})}
                />

                <TextField
                    name="password"
                    type="password"
                    label="Password"
                    customSize="title"
                    required
                    className="md-cell md-cell--12"
                    onChange={(value) => this.setState({password: value})}
                />

                <TextField
                    name="name"
                    label="Name"
                    customSize="title"
                    className="md-cell md-cell--12"
                    onChange={(value) => this.setState({name: value})}
                />

                <SelectField
                    name="language"
                    label="Language"
                    className="md-cell md-cell--12"
                    defaultValue={this.state.language}
                    menuItems={this.props.languages}
                    onChange={(value) => this.setState({language: value})}/>

                <Button
                    raised
                    onClick={this.register.bind(this)}
                    className="md-cell--center"
                >Create account</Button>

                <div>
                    {this.state.errors.map((errorMessage, key) => (<div key={key}>{errorMessage}</div>))}
                </div>
            </form>
        )
    }
}

RegistrationScreen.propTypes = {
    languages: PropTypes.array.isRequired,
    preferredLanguage: PropTypes.string.isRequired,
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
)(AutoFill(RegistrationScreen));