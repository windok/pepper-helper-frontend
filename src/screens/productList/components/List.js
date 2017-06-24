import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';
import {ListItem as ListItemModel, STATUS_DRAFT, STATUS_BOUGHT} from 'Models/ListItem';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import BuyIcon from 'material-ui/svg-icons/action/done';
import ReturnIcon from 'material-ui/svg-icons/content/undo';

import Item from './Item';

import {getListItemsToDisplay} from 'Reducers/storage/listItem';
import {getGroupCollection} from 'Reducers/storage/group';

import {buyItem, returnItem} from 'Actions/listItem';

class List extends React.PureComponent {
    render() {
        // todo refactor, separate into smaller components

        const groupedItems = new Map();

        /**
         * @type {ListItem} listItem
         */
        this.props.listItems.forEach(listItem => {
            if (!groupedItems.has(listItem.getGroupId())) {
                groupedItems.set(listItem.getGroupId(), []);
            }

            const componentProps = {
                key: listItem.getId()
            };

            let arrayInsertMethod = 'unshift';

            if (listItem.getStatus() === STATUS_DRAFT) {
                componentProps.onTouchTap = () => this.props.editItem(listItem);
                // todo replace button with swipe, keep button only for desktop
                componentProps.rightIconButton = <IconButton tooltip="buy" onTouchTap={() => this.props.buyItem(listItem)}><BuyIcon/></IconButton>;
            }

            if (listItem.getStatus() === STATUS_BOUGHT) {
                componentProps.style = {textDecoration: 'line-through'};
                // todo replace button with swipe, keep button only for desktop
                componentProps.rightIconButton = <IconButton tooltip="return" onTouchTap={() => this.props.returnItem(listItem)}><ReturnIcon/></IconButton>;

                arrayInsertMethod = 'push';
            }

            groupedItems.get(listItem.getGroupId())[arrayInsertMethod](
                <ListItemComponent {...componentProps}><Item listItem={listItem}/></ListItemComponent>
            );
        });

        const groupedItemElements = [];

        groupedItems.forEach((nestedListItems, groupId) => {
            groupedItemElements.push(<ListItemComponent key={groupId} nestedItems={nestedListItems} open={true}>
                {this.props.groups.has(groupId) ? this.props.groups.get(groupId).getName() : 'n/a'}
            </ListItemComponent>)
        });

        return (
            <div>
                <ListComponent>{groupedItemElements}</ListComponent>
            </div>
        );
    }
}

List.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    listItems: PropTypes.instanceOf(Map).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired,
    editItem: PropTypes.func.isRequired,
    buyItem: PropTypes.func.isRequired,
    returnItem: PropTypes.func.isRequired
};

export default connect(
    (state, {list}) => {
        return {
            list,
            listItems: getListItemsToDisplay(state, list),
            groups: getGroupCollection(state)
        };
    },
    (dispatch, {history}) => {
        return {
            editItem: (listItem) => {
                // todo separate url for edit
                history.push('/product-list/' + listItem.getListId() + '/add-item/save/' + listItem.getProductId());
            },
            buyItem: (listItem) => buyItem(listItem)(dispatch),
            returnItem: (listItem) => returnItem(listItem)(dispatch)
        };
    }
)(List);
