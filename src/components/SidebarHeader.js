import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Toolbar from 'react-md/lib/Toolbars';
import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';

import {hideMenu} from 'actions/ui';
import {getUser} from 'reducers/user';
import User from 'models/User';

import {history} from 'services/BrowserHistory'

class SidebarHeader extends React.PureComponent {
    render() {

        return (
            <div className="drawers__toolbar md-divider-border md-divider-border--bottom md-background--primary">

                <Avatar>{this.props.user.getName()[0]}</Avatar>

                <Toolbar
                    colored
                    nav={<div className="md-grid">
                        <div className="md-cell--12 md-text-bold">{this.props.user.getName()}</div>
                        <div className="md-cell--12">{this.props.user.getEmail()}</div>
                    </div>}
                    actions={<Button icon key="edit-list" onClick={this.props.showProfile}>settings</Button>}
                />
            </div>
        );
    }
}

SidebarHeader.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    showProfile: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            user: getUser(state)
        };
    },
    (dispatch) => {
        return {
            showProfile: () => {
                history.push('/user');

                hideMenu()(dispatch);
            }
        };
    }
)(SidebarHeader);
