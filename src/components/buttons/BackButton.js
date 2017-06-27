import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import history from 'Services/BrowserHistory';

import Button from './Button';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';

const BackButton = connect(
    (state) => {return {
        icon: <BackIcon/>,
        tooltip: 'Back'
    }},
    (dispatch, {onTouchTap}) => {
        return {
            onTouchTap: (event) => {
                onTouchTap && onTouchTap();
                history.goBack();
            }
        }
    }
)(Button);

BackButton.propTypes = {
    onTouchTap: PropTypes.func
};

export default BackButton;