import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';

import SaveIcon from 'material-ui/svg-icons/content/send';
import ForwardIcon from 'material-ui/svg-icons/content/forward';

class Button extends React.PureComponent {
    render() {
        return (
            <IconButton
                onTouchTap={this.props.onTouchTap}
                tooltip={this.props.tooltip}
            >
                {this.props.icon}
            </IconButton>
        );
    }
}

Button.propTypes = {
    icon: PropTypes.element.isRequired,
    onTouchTap: PropTypes.func,
    tooltip: PropTypes.string
};

export default Button;

const SaveButton = (props) => (
    <Button icon={<SaveIcon/>} {...props}/>
);

const ForwardButton = (props) => (
    <Button icon={<ForwardIcon/>} {...props}/>
);

export {Button, SaveButton, ForwardButton};