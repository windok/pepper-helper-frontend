import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem, ListItemNullObject} from 'Models/ListItem';
import {Group, GroupNullObject} from 'Models/Group';
import {Product, ProductNullObject} from 'Models/Product';
import {Unit, UnitNullObject} from 'Models/Unit';

import {getProduct} from 'Reducers/storage/product';
import {getUnit} from 'Reducers/storage/unit';

class Item extends React.PureComponent {
    render() {
        if (this.props.listItem.isNullObject()) {
            return (<span></span>);
        }

        return (
            <span>
                {this.props.product.getName()} - {this.props.listItem.getQuantity()} {this.props.unit.getName()}
            </span>
        )
    }
}

Item.propTypes = {
    listItem: PropTypes.instanceOf(ListItem).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    unit: PropTypes.instanceOf(Unit).isRequired,
};

export default connect(
    (state, {listItem}) => {
        return {
            listItem,
            product: getProduct(state, listItem.getProductId()),
            unit: getUnit(state, listItem.getUnitId())
        }
    }
)(Item);
