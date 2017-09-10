import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';

import ListItem from 'react-md/lib/Lists/ListItem';
import Icon from 'react-md/lib/FontIcons';
import ItemLabel from './ItemLabel';

import {buyItem} from 'Actions/listItem';

import history from 'Services/BrowserHistory';

class DraftItem extends React.PureComponent {
    render() {
        const buyButton = (
            <Icon onTouchTap={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                this.props.buyItem(this.props.item);
            }}> done </Icon>
        );

        const label = <ItemLabel item={this.props.item}/>;

        return (
            <ListItem
                primaryText={label}
                onTouchTap={() => this.props.editItem(this.props.item)}
                rightIcon={buyButton}
            />
        )
    }
}

DraftItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    editItem: PropTypes.func.isRequired,
    buyItem: PropTypes.func.isRequired
};

export default connect(
    (state, {item}) => {
        return {item}
    },
    (dispatch) => {
        return {
            editItem: (listItem) => history.push('/product-list/' + listItem.getListId() + '/item/' + listItem.getId()),
            buyItem: (listItem) => buyItem(listItem)(dispatch),
        }
    }
)(DraftItem);
