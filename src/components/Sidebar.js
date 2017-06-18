import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {showMenu, hideMenu, toggleMenu} from 'Actions/ui';

import Drawer from 'material-ui/Drawer';
import UserSidebarWidget from 'Screens/user';
import ProductListCollectionSidebarWidget from 'Screens/productListCollection';


class Sidebar extends React.PureComponent {
    render() {
        return (
            <Drawer
                docked={false}
                width={300}
                open={this.props.isOpened}
                onRequestChange={this.props.toggleMenu}
            >
                <UserSidebarWidget/>
                <ProductListCollectionSidebarWidget/>
            </Drawer>
        );
    }
}

export default connect(
    (state) => {
        return {
            isOpened: state.ui.sidebar.isOpened
        }
    },
    (dispatch) => {
        return {
            toggleMenu: () => toggleMenu()(dispatch)
        }
    }
)(Sidebar);