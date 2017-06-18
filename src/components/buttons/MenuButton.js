import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {toggleMenu} from 'Actions/ui';

import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

class MenuButton extends React.PureComponent {
    render() {
        return (
            <IconButton tooltip="Menu" onTouchTap={this.props.onTouchTap} >
                <MenuIcon />
            </IconButton>
        );
    }
}

MenuButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired
};

export default connect(
    () => {return {}},
    (dispatch, {onTouchTap}) => {
        return {
            onTouchTap: (event) => {
                onTouchTap && onTouchTap(event);
                toggleMenu()(dispatch);
            }
        }
    }
)(MenuButton);