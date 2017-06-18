import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import ForwardIcon from 'material-ui/svg-icons/content/forward';

class ForwardToSaveButton extends React.PureComponent {
    render() {
        return (
            <IconButton tooltip="Create" onTouchTap={this.props.onTouchTap} >
                <ForwardIcon />
            </IconButton>
        );
    }
}

ForwardToSaveButton.propTypes = {
    onTouchTap: PropTypes.func.isRequired
};

export default ForwardToSaveButton;

// export default connect(
//     () => {return {}},
//     (dispatch, {history}) => {
//         return {
//             onTouchTap: (event) => history.goBack()
//         }
//     }
// )(ForwardToSaveButton);