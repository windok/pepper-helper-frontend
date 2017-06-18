import React from 'react';
import PropTypes from 'prop-types';

class HeaderLink extends React.PureComponent {
    render() {
        return (
            <div onClick={this.props.onClickHandler}>
                {this.props.children}
            </div>
        );
    }
}

HeaderLink.propTypes = {
    // title: PropTypes.string.isRequired,
    onClickHandler: PropTypes.func.isRequired
};

export default HeaderLink;