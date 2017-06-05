import React from 'react';
import PropTypes from 'prop-types';

class HeaderLink extends React.PureComponent {
    render() {
        // todo change to background img
        const image = this.props.image ? <div>{this.props.image}</div> : '';

        return (
            <div onClick={this.props.onClickHandler}>
                {image}
                <div>{this.props.title}</div>
            </div>
        );
    }
}

HeaderLink.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.any,
    onClickHandler: PropTypes.func.isRequired
};

export default HeaderLink;