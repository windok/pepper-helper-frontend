import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import Snackbar from "react-md/lib/Snackbars";

import List from 'Models/List';

import {share} from 'Actions/list';

import {getUser} from 'Reducers/user';

class ShareList extends React.PureComponent {

    state = {email: '', toasts: []};

    dismissToast = () => {
        this.setState({toasts: []});
    };

    shareList = () => {
        if (!this.state.email.trim()) {
            return;
        }

        this.props.share(this.props.list, this.state.email)
            .then(() => this.setState({
                email: '',
                toasts: [{text: 'List was shared successfully with ' + this.state.email}],
            }))
            .catch((error) => {
                this.setState({
                    toasts: [{text: 'Failed to share with ' + this.state.email}]
                });
            });
    };

    render() {
        // todo global snackbar component to show event results into

        return (
            <div>
                <form className="md-grid">
                    <TextField
                        id="share-email"
                        label="Email to share with"
                        customSize="title"
                        className="md-cell md-cell--8"
                        value={this.state.email}
                        type="email"
                        onChange={(value) => this.setState({email: value})}
                    />
                    <Button
                        raised
                        iconEl={<FontIcon>share</FontIcon>}
                        onClick={this.shareList}
                        className="md-cell md-cell--4"
                    >Share list</Button>
                </form>

                <Snackbar
                    id="share-snackbar"
                    toasts={this.state.toasts}
                    autohide={true}
                    autohideTimeout={5000}
                    onDismiss={this.dismissToast}
                />
            </div>
        );
    }
}

ShareList.propTypes = {
    list: PropTypes.instanceOf(List).isRequired,
    share: PropTypes.func.isRequired,
};

export default connect(
    (state) => ({
        share: (list, email) => share(list, getUser(state), email)
    })
)(ShareList);