import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Toolbar from 'react-md/lib/Toolbars';
import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';

import {hideMenu} from 'Actions/ui';
import {getUser} from 'Reducers/user';
import {logout} from 'Actions/user';
import User from 'Models/User';

import {redirectToDefaultList} from 'Services/BrowserHistory'

class UserSidebarHeader extends React.PureComponent {
    render() {

        const toolbarNav = (
            <div>
                <Avatar>{this.props.user.getName()[0]}</Avatar> {this.props.user.getName()}
            </div>
        );

        return (
            <div className="md-divider-border md-divider-border--bottom">
                <Toolbar
                    nav={toolbarNav}
                    actions={<Button icon onClick={this.props.hideMenu}>close</Button>}
                />
                <div className="md-grid">
                    <Button
                        raised
                        secondary
                        onTouchTap={this.props.logout}
                        className="md-cell--center"
                    >Logout</Button>
                </div>
            </div>

        );
    }
}

UserSidebarHeader.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    logout: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            user: getUser(state)
        };
    },
    (dispatch) => {
        return {
            logout: () => {
                logout()(dispatch);

                redirectToDefaultList();
            },
            hideMenu: () => hideMenu()(dispatch)
        };
    }
)(UserSidebarHeader);
