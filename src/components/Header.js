import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';

class Header extends React.PureComponent {
    render() {
        return (
            <AppBar
                title={this.props.title}
                iconElementLeft={<div>{this.props.leftLinks}</div>}
                iconElementRight={<div>{this.props.rightLinks}</div>}
            />
        );
    }
}


Header.defaultProps = {
    leftLinks: [],
    rightLinks: [],
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    leftLinks: PropTypes.array,
    rightLinks: PropTypes.array
};

export default Header;

