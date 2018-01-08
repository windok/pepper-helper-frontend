import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AutoFill from 'Lib/react-autofill';

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import Toast from "Models/Toast";

import {getAvailableLanguages, getUnitTypes} from 'Reducers/app';
import {getUser} from "Reducers/user";
import {getAuthErrorMessage, isAuthRequestSent} from "Reducers/auth";

import {redirectToDefaultList} from 'Services/BrowserHistory';

import {addToast} from "Actions/app";
import {register} from 'Actions/auth';

class RegistrationScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            language: props.preferredLanguage,
            unitType: this.getDefaultUnitType()
        };
    }

    componentWillReceiveProps({user, errorMessage}) {
        user && redirectToDefaultList();
        errorMessage && this.props.errorMessage !== errorMessage && this.props.addToast(errorMessage);
    }

    getDefaultUnitType() {
        const unitTypes = this.props.getUnitTypes(this.props.preferredLanguage);

        return (unitTypes[0] && unitTypes[0].value) || this.props.getUnitTypes('en')[0].value;
    }

    onLanguageChange = (lang) => {
        let userUnitType = this.state.unitType;
        const availableUnitTypes = this.props.getUnitTypes(lang);

        // if not possible to leave currently selected unit
        if (availableUnitTypes.filter(unitType => unitType.value === userUnitType).length === 0) {
            userUnitType = availableUnitTypes ? availableUnitTypes[0].value : this.getDefaultUnitType();
        }

        this.setState({
            language: lang,
            unitType: userUnitType
        });
    };

    register = () => {
        if (!/\S+@\S+\.\S+/.test(this.state.email)) {
            this.props.addToast('Email field is not valid.');

            return;
        }

        if (this.props.isRequestSent) {
            return;
        }

        const user = {
            email: this.state.email,
            password: this.state.password,
            language: this.state.language,
            unitType: this.state.unitType
        };

        if (this.state.name) {
            user.name = this.state.name
        }

        this.props.register(user);
    };

    render() {
        return (
            <form className="md-grid" onSubmit={event => {
                event.preventDefault();
                this.register();
            }}>
                <div className="md-cell md-cell--12">
                    <TextField
                        id="signup-email"
                        name="email"
                        type="email"
                        label="Email"
                        required
                        onChange={(value) => this.setState({email: value})}
                    />

                    <TextField
                        id="signup-password"
                        name="password"
                        type="password"
                        label="Password"
                        required
                        onChange={(value) => this.setState({password: value})}
                    />

                    <TextField
                        id="signup-name"
                        name="name"
                        label="Name"
                        onChange={(value) => this.setState({name: value})}
                    />

                </div>
                <SelectField
                    id="signup-language"
                    name="language"
                    label="Language"
                    value={this.state.language}
                    menuItems={this.props.languages}
                    onChange={this.onLanguageChange}
                    className="md-cell md-cell--12"
                    sameWidth
                />

                <SelectField
                    id="signup-unitType"
                    name="unitType"
                    label="UnitType"
                    value={this.state.unitType}
                    menuItems={this.props.getUnitTypes(this.state.language)}
                    onChange={(value) => this.setState({unitType: value})}
                    className="md-cell md-cell--12"
                    sameWidth
                />

                <Button
                    raised
                    primary
                    type="submit"
                    className="md-cell md-cell--12"
                    disabled={this.props.isRequestSent}
                >Create account</Button>
            </form>
        )
    }
}

RegistrationScreen.propTypes = {
    languages: PropTypes.array.isRequired,
    preferredLanguage: PropTypes.string.isRequired,
    isRequestSent: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,

    getUnitTypes: PropTypes.func.isRequired,

    register: PropTypes.func.isRequired,
    addToast: PropTypes.func.isRequired
};

export default connect(
    (state) => {

        const languages = getAvailableLanguages(state);
        const browserLanguages = (navigator.language || navigator.userLanguage).split(',');

        const preferredLanguages = browserLanguages.filter(language => languages.includes(language.split('-')));

        return {
            languages,
            preferredLanguage: preferredLanguages.length ? preferredLanguages[0] : languages[0],
            getUnitTypes: (lang) => getUnitTypes(state, lang),
            user: getUser(state),
            isRequestSent: isAuthRequestSent(state),
            errorMessage: getAuthErrorMessage(state)
        }
    },
    (dispatch) => ({
        register: (userData) => dispatch(register(userData)),
        addToast: (text) => dispatch(addToast(new Toast({id: 'signUp-toast', text, autohideTimeout: 4000})))
    })
)(AutoFill(RegistrationScreen));
