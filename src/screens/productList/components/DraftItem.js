import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem} from 'Models/ListItem';

import {ListItem as ListItemComponent} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import BuyIcon from 'material-ui/svg-icons/action/done';
import ItemLabel from './ItemLabel';

import {buyItem} from 'Actions/listItem';

import history from 'Services/BrowserHistory';

class DraftItem extends React.PureComponent {
    render() {
        const buyButton = (
            <IconButton tooltip="buy" onTouchTap={() => this.props.buyItem(this.props.item)}>
                <BuyIcon/>
            </IconButton>
        );

        return (
            <ListItemComponent onTouchTap={() => this.props.editItem(this.props.item)}
                               rightIconButton={buyButton}>
                <ItemLabel item={this.props.item}/>
            </ListItemComponent>
        )
    }
}

DraftItem.propTypes = {
    item: PropTypes.instanceOf(ListItem).isRequired,
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
