import React from 'react';
import PropTypes from 'prop-types'

class Item extends React.PureComponent {
    render() {
        return (
            <span>{JSON.stringify(this.props)}</span>
        )
    }
}

Item.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.any.isRequired
};

export default Item;
