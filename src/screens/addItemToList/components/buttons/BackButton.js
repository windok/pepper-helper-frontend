import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';

class BackButton extends React.PureComponent {
    render() {
        return (
            <IconButton tooltip="Back" onTouchTap={this.props.onTouchTap} >
                <BackIcon />
            </IconButton>
        );
    }
}

BackButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired
};

export default connect(
    () => {return {}},
    (dispatch, {history}) => {
        return {
            onTouchTap: (event) => history.goBack()
        }
    }
)(BackButton);