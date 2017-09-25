import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';
import Item from './Item';
import ItemAction from './ItemAction';

class SuspendedItem extends React.PureComponent {
    render() {

        const leftAction = new ItemAction(
            () => {},
            'undo',
            'To list',
            'item-return'
        );

        const rightAction = new ItemAction(
            () => {},
            'schedule',
            'Reschedule',
            'item-suspend'
        );

        return (
            <Item
                leftAction={leftAction}
                rightAction={rightAction}
                item={this.props.item}
            />
        );
    }
}

SuspendedItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    returnItem: PropTypes.func.isRequired
};

export default connect(
    (state, {item}) => {
        return {item}
    },
    (dispatch) => {
        return {
            returnItem: (listItem) => returnItem(listItem)(dispatch)
        }
    }
)(SuspendedItem);

