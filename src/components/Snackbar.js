import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SnackbarComponent from "react-md/lib/Snackbars";

import {Toast} from 'Models/Toast';

import {getFirstToast} from 'Reducers/app';
import {releaseToast} from "Actions/app";

class Snackbar extends React.PureComponent {

    onDismissToast = () => {
        this.props.toast.onDismiss();
        this.props.releaseToast();
    };

    getToastToShow = () => {
        const toast = {
            text: this.props.toast.getText()
        };

        if (this.props.toast.getActionLabel()) {
            toast.action = {
                children: this.props.toast.getActionLabel(),
                onClick: this.props.toast.onActionClick,
            }
        }

        return toast;
    };
    
    render() {
        const toast = this.props.toast;

        return (
            <div>
                {this.props.children}
                {toast && <SnackbarComponent
                    id={this.props.toast.getId()}
                    toasts={[this.getToastToShow()]}
                    autohide={this.props.toast.getAutohide()}
                    autohideTimeout={this.props.toast.getAutohideTimeout()}
                    onDismiss={this.onDismissToast}
                />}
            </div>
        );
    }
}

Snackbar.propTypes = {
    children: PropTypes.any.isRequired,
    toast: PropTypes.instanceOf(Toast),
    releaseToast: PropTypes.func.isRequired
};

export default connect(
    state => ({
        toast: getFirstToast(state)
    }),
    dispatch => ({
        releaseToast: () => dispatch(releaseToast())
    })
)(Snackbar);