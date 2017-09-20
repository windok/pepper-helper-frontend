import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {toggleMenu} from 'Actions/ui';

import {isSidebarOpened, getListManagerMode} from 'Reducers/ui';

import Drawer from 'react-md/lib/Drawers';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons/Button';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import UserSidebarWidget from 'Screens/user';
import ListCollection from 'Screens/productListCollection/ListCollection';
import ListsManager from 'Screens/productListCollection/ListsManager';


class Sidebar extends React.PureComponent {
    render() {

        const header = <Toolbar
            nav={<div><Avatar>J</Avatar> John Doe</div>}
            title="My lists"
            prominentTitle
            actions={<Button icon onClick={this.props.toggleMenu}>close</Button>}
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
                onVisibilityChange={() => {}}
                type={Drawer.DrawerTypes.TEMPORARY}
                header={header}
            >
                {this.props.listManagerModeEnabled
                    ? (<ListsManager/>)
                    : (
                        <div>
                            {/*<UserSidebarWidget/>*/}
                            {/*<h3>My lists</h3>*/}
                            {/*<Divider style={{marginTop: 10, marginBottom: 10}}/>*/}
                            <ListCollection/>
                        </div>
                    )}
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    listManagerModeEnabled: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            isOpened: isSidebarOpened(state),
            listManagerModeEnabled: getListManagerMode(state)
        }
    },
    (dispatch) => {
        return {
            toggleMenu: () => toggleMenu()(dispatch)
        }
    }
)(Sidebar);