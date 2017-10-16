import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import history from 'Services/BrowserHistory';

import Button from './Button';
import FontIcon from 'react-md/lib/FontIcons';

const BackButton = connect(
    (state, props) => ({
        icon: <FontIcon>{props.iconType || 'chevron_left'}</FontIcon>,
        tooltip: 'Back'
    }),
    (dispatch, {onClick}) => {
        return {
            onClick: (event) => {
                onClick && onClick();
                history.goBack();
            }
        }
    }
)(Button);

BackButton.propTypes = {
    iconType: PropTypes.string,
    onClick: PropTypes.func
};

export default BackButton;