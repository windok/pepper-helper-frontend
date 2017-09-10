import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

class IconButton extends React.PureComponent {
    render() {
        return (
            <Button
                icon
                onTouchTap={this.props.onTouchTap}
            >{this.props.icon}</Button>
        );
    }
}

IconButton.propTypes = {
    icon: PropTypes.element.isRequired,
    onTouchTap: PropTypes.func,
    tooltip: PropTypes.string
};

export default IconButton;

const SaveButton = (props) => (
    <Button flat onTouchTap={props.onTouchTap}>Save</Button>
);

export {IconButton, SaveButton};