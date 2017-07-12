import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem} from 'Models/ListItem';
import {Product} from 'Models/Product';
import {Unit} from 'Models/Unit';

import {getProduct} from 'Reducers/storage/product';
import {getUnit} from 'Reducers/storage/unit';

class ItemLabel extends React.PureComponent {
    render() {
        return (
            <span>
                {this.props.product.getName()} - {this.props.item.getQuantity()} {this.props.unit.getName()}
            </span>
        )
    }
}

ItemLabel.propTypes = {
    item: PropTypes.instanceOf(ListItem).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    unit: PropTypes.instanceOf(Unit).isRequired,
};

export default connect(
    (state, {item}) => {
        return {
            item,
            product: getProduct(state, item.getProductId()),
            unit: getUnit(state, item.getUnitId())
        }
    }
)(ItemLabel);
