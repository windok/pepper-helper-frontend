import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

class IconButton extends React.PureComponent {
    render() {
        return (
            <Button
                icon
                onClick={this.props.onClick}
                className={this.props.className}
            >{this.props.icon}</Button>
        );
    }
}

IconButton.propTypes = {
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func,
    tooltip: PropTypes.string
};

export default IconButton;

const SaveButton = (props) => (
    <Button flat onClick={props.onClick}>Save</Button>
);

export {IconButton, SaveButton};