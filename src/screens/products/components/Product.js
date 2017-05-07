import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Product extends Component {

    render() {
        return (
            <div>
                {this.props.id} - {this.props.name} - {this.props.state}
            </div>
        )
    }

}

Product.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired
};

export default Product;