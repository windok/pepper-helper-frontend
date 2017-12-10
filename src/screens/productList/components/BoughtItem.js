import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';
import Item from './Item';
import ItemAction from './ItemAction';

import {returnItem} from 'Actions/listItem';

class BoughtItem extends React.PureComponent {
    render() {

        const leftAction = new ItemAction(
            this.props.returnItem.bind(this),
            'undo',
            'Return',
            'item-return'
        );

        return (
            <Item
                leftAction={leftAction}
                rightAction={leftAction}
                item={this.props.item}
            />
        );
    }
}

BoughtItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    returnItem: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch) => ({
        returnItem: (listItem) => dispatch(returnItem(listItem))
    })
)(BoughtItem);

