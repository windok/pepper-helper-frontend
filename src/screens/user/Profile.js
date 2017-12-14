import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AutoFill from 'Lib/react-autofill';

import User from "Models/User";

import {getUser} from "Reducers/user";

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import Divider from 'react-md/lib/Dividers';

import Header from "Components/Header";
import BackButton from "Components/buttons/BackButton";

import {logout} from 'actions/auth';
import {redirectToDefaultList} from 'services/BrowserHistory'

class Profile extends React.PureComponent {

    state = {
        language: 'en',
        errors: []
    };

    save = () => {
    };

    render() {
        return (
            <div>

                <Header title={"User profile"} leftLinks={<BackButton/>}/>

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
                        onClick={this.save}
                        className="md-cell--center"
                    >Save</Button>

                    <div>
                        {this.state.errors.map((errorMessage, key) => (<div key={key}>{errorMessage}</div>))}
                    </div>
                </form>

                <Divider style={{marginTop: 40, marginBottom: 40}}/>

                <div className="md-grid">
                    <Button
                        raised
                        secondary
                        onClick={this.props.logout}
                        className="md-cell--right"
                    >Logout</Button>
                </div>

            </div>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.instanceOf(User).isRequired
};

// todo edit name
// todo edit units
// todo edit language
// todo edit avatar
// todo edit default product list
// todo edit unit type

// todo edit email
// todo edit password

export default connect(
    (state) => ({
        user: getUser(state)
    }),
    (dispatch) => ({
        logout: () => {
            dispatch(logout());

            redirectToDefaultList();
        }
    })
)(AutoFill(Profile));