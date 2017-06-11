import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem, ListItemNullObject} from 'Models/ListItem';
import {Group, GroupNullObject} from 'Models/Group';
import {Product, ProductNullObject} from 'Models/Product';
import {Unit, UnitNullObject} from 'Models/Unit';

class Item extends React.PureComponent {
    render() {
        if (this.props.listItem.isNullObject()) {
            return (<span></span>);
        }

        return (
            <span>
                {this.props.group.getName()}: {this.props.product.getName()} - {this.props.listItem.getQuantity()} {this.props.unit.getName()}
            </span>
        )
    }
}

Item.propTypes = {
    listItem: PropTypes.instanceOf(ListItem).isRequired,
    group: PropTypes.instanceOf(Group).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    unit: PropTypes.instanceOf(Unit).isRequired,
};

export default connect(
    (state, {listItem}) => {
        return {
            listItem,
            group: state.storage.group.items.get(listItem.getGroupId()) || GroupNullObject(),
            product: state.storage.product.items.get(listItem.getProductId()) || ProductNullObject(),
            unit: state.storage.unit.items.get(listItem.getUnitId()) || UnitNullObject()
        }
    }
)(Item);
