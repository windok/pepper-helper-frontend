import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.PureComponent {
    render() {
        return (
            <div>
                <div>{this.props.leftLinks.map((link, index) => <div key={index}>{link}</div>)}</div>
                <div>{this.props.title}</div>
                <div>{this.props.rightLinks.map((link, index) => <div key={index}>{link}</div>)}</div>
            </div>
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

