import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class CloseButton extends React.PureComponent {
    render() {
        return (
            <IconButton tooltip="Close" onTouchTap={this.props.onTouchTap} >
                <CloseIcon />
            </IconButton>
        );
    }
}

CloseButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired
};

export default connect(
    () => {return {}},
    (dispatch, {history}) => {
        return {
            onTouchTap: (event) => history.goBack()
        }
    }
)(CloseButton);