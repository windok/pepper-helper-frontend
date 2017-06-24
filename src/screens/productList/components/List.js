import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';
import {ListItem as ListItemModel, STATUS_DRAFT, STATUS_BOUGHT} from 'Models/ListItem';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';
import Item from './Item';

import {getListItemsToDisplay} from 'Reducers/storage/listItem';
import {getGroupCollection} from 'Reducers/storage/group';

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

            if (listItem.getStatus() === STATUS_DRAFT) {
                componentProps.onTouchTap = () => this.props.editItem(listItem)
            }

            if (listItem.getStatus() === STATUS_BOUGHT) {
                componentProps.style = {textDecoration: 'line-through'}
            }

            groupedItems.get(listItem.getGroupId()).push(
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
    editItem: PropTypes.func.isRequired
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
            }
        };
    }
)(List);
