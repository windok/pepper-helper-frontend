import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/send';

class SaveButton extends React.PureComponent {
    render() {
        return (
            <IconButton tooltip="Save" onTouchTap={this.props.onTouchTap} >
                <SaveIcon />
            </IconButton>
        );
    }
}

SaveButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired
};

export default connect(
    () => {return {}},
    (dispatch, {history}) => {
        return {
            onTouchTap: (event) => history.goBack()
        }
    }
)(SaveButton);