import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {showMenu} from 'Actions/ui';

import Button from './Button';
import FontIcon from 'react-md/lib/FontIcons';

const MenuButton = connect(
    (state) => {return {
        icon: <FontIcon>menu</FontIcon>,
        className: 'md-btn--toolbar',
        tooltip: 'Menu'
    }},
    (dispatch, {onTouchTap}) => {
        return {
            onTouchTap: (event) => {
                onTouchTap && onTouchTap();
                showMenu()(dispatch);
            }
        }
    }
)(Button);

MenuButton.propTypes = {
    onTouchTap: PropTypes.func
};

export default MenuButton;