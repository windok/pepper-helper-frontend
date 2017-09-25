import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {hideMenu, showMenu} from 'Actions/ui';

import {isSidebarOpened} from 'Reducers/ui';

import Drawer from 'react-md/lib/Drawers';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons/Button';
import Avatar from 'react-md/lib/Avatars';
import ListCollection from 'Screens/productListCollection/ListCollection';

class Sidebar extends React.PureComponent {
    render() {

        const header = <Toolbar
            nav={<div><Avatar>J</Avatar> John Doe</div>}
            prominentTitle
            actions={<Button icon onClick={this.props.hideMenu}>close</Button>}
            className="md-divider-border md-divider-border--bottom"
        />;

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
                header={header}
            >
                <ListCollection currentList={this.props.currentList}/>
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
    (state) => {
        return {
            isOpened: isSidebarOpened(state)
        }
    },
    (dispatch) => {
        return {
            showMenu: () => showMenu()(dispatch),
            hideMenu: () => hideMenu()(dispatch)
        }
    }
)(Sidebar);