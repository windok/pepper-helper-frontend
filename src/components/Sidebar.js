import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {showMenu, hideMenu, toggleMenu} from 'Actions/ui';

import {isSidebarOpened, getListManagerMode} from 'Reducers/ui';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import UserSidebarWidget from 'Screens/user';
import ListCollection from 'Screens/productListCollection/ListCollection';
import ListsManager from 'Screens/productListCollection/ListsManager';


class Sidebar extends React.PureComponent {
    render() {
        return (
            <Drawer
                docked={false}
                width={300}
                open={this.props.isOpened}
                onRequestChange={this.props.toggleMenu}
            >
                {this.props.listManagerModeEnabled
                    ? (<ListsManager/>)
                    : (
                        <div>
                            <UserSidebarWidget/>
                            <Divider style={{marginTop: 10, marginBottom: 10}}/>
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