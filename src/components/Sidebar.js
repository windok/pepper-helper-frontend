import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {hideMenu, showMenu} from 'Actions/ui';

import {isSidebarOpened} from 'Reducers/ui';

import Drawer from 'react-md/lib/Drawers';
import ListCollection from 'Screens/productListCollection/ListCollection';
import UserSidebarHeader from 'components/SidebarHeader';

class Sidebar extends React.PureComponent {
    render() {
        return (
            <Drawer
                autoclose
                mobileMinWidth={300}
                position="left"
                overlay
                clickableDesktopOverlay
                visible={this.props.isOpened}
                onVisibilityChange={(visible) => {
                    visible ? this.props.showMenu() : this.props.hideMenu();
                }}
                type={Drawer.DrawerTypes.TEMPORARY}
                header={<UserSidebarHeader/>}
                className="dialogs__content drawers__content__scrollable"
            >
                <ListCollection/>
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    isOpened: PropTypes.bool.isRequired,

    showMenu: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired
};

export default connect(
    (state) => ({
        isOpened: isSidebarOpened(state),
    }),
    (dispatch) => ({
        showMenu: () => showMenu()(dispatch),
        hideMenu: () => hideMenu()(dispatch)
    })
)(Sidebar);