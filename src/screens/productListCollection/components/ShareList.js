import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Toast from 'Models/Toast';

import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

import List from 'Models/List';

import {share} from 'Actions/list';
import {addToast} from 'Actions/app';

import {getUser} from 'Reducers/user';

class ShareList extends React.PureComponent {

    state = {email: ''};

    shareList = () => {
        if (!this.state.email.trim()) {
            return;
        }

        this.props.share(this.props.list, this.state.email)
            .then(() => {
                this.setState({email: ''});
                this.props.addToast('List was shared successfully with ' + this.state.email);
            })
            .catch((error) => {
                this.props.addToast('Failed to share with ' + this.state.email);
            });
    };

    render() {
        return (
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
        );
    }
}

ShareList.propTypes = {
    list: PropTypes.instanceOf(List).isRequired,
    share: PropTypes.func.isRequired,

    addToast: PropTypes.func.isRequired
};

export default connect(
    (state) => ({
        share: (list, email) => share(list, getUser(state), email)
    }),
    dispatch => ({
        addToast: (toastMessage) => dispatch(addToast(new Toast({
            id: 'share-list-toast',
            text: toastMessage,
        })))
    })
)(ShareList);