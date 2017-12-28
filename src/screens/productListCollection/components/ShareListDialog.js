import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Toast from 'Models/Toast';

import TextField from 'react-md/lib/TextFields';
import DialogContainer from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';

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
                this.props.addToast('List was shared successfully with ' + this.state.email);
                this.setState({email: ''});
            })
            .catch((error) => {
                this.props.addToast('Failed to share with ' + this.state.email);
            });
    };

    onEmailFieldChange = (email) => this.setState({email});

    render() {
        const actions = [];
        actions.push({secondary: true, children: 'Cancel', onClick: this.props.hide});
        actions.push(<Button flat primary onClick={this.shareList}>Share</Button>);

        return (
            <DialogContainer
                id="share-list-dialog"
                visible={this.props.visible}
                onHide={this.props.hide}
                actions={actions}
                title="Share list with"
            >
                <TextField
                    id="share-list-dialog-email-field"
                    type="email"
                    label="Email"
                    placeholder="Share with..."
                    value={this.state.email}
                    onChange={this.onEmailFieldChange}
                />
            </DialogContainer>
        );
    }
}

ShareList.propTypes = {
    list: PropTypes.instanceOf(List).isRequired,
    visible: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
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