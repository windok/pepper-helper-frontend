import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import User from "Models/User";

import {getUser} from "Reducers/user";

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import Header from "Components/Header";
import BackButton from "Components/buttons/BackButton";

class Profile extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            language: 'en',
            errors: []
        };
    }

    save() {
    }

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
                        onTouchTap={this.save.bind(this)}
                        className="md-cell--center"
                    >Create account</Button>

                    <div>
                        {this.state.errors.map((errorMessage, key) => (<div key={key}>{errorMessage}</div>))}
                    </div>
                </form>

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

// todo edit email
// todo edit password

export default connect(
    (state) => ({
        user: getUser(state)
    }),
    (dispatch) => ({})
)(Profile);