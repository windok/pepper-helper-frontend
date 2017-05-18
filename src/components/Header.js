import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Header extends Component {
    render() {
        return (
            <div>
                <span style="padding:20px;">Action links at left side</span>
                <span style="padding:20px;">Screen name: {this.props.screenName}</span>
                <span style="padding:20px;">Action links at right side</span>
            </div>
        );
    }
}

Header.propTypes = {
    screenName: PropTypes.string.isRequired,
};

export default Header;