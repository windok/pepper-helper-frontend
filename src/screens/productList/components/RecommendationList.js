import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';

import Item from './Item';

import {getRecommendedListItems} from 'Reducers/storage/listItem';
import {getGroupCollection} from 'Reducers/storage/group';

import history from 'Services/BrowserHistory';

class GeneralList extends React.PureComponent {
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

            groupedItems.get(listItem.getGroupId()).push(
                <ListItemComponent key={listItem.getId()}
                                   onTouchTap={() => this.props.editItem(listItem)}>
                    <Item listItem={listItem}/>
                </ListItemComponent>
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

GeneralList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    listItems: PropTypes.instanceOf(Map).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired,
    editItem: PropTypes.func.isRequired,
};

export default connect(
    (state, {list}) => {
        return {
            list,
            listItems: getRecommendedListItems(state, list),
            groups: getGroupCollection(state)
        };
    },
    (dispatch) => {
        return {
            editItem: (item) => history.push('/product-list/' + item.getListId() + '/item/' + item.getId())
        };
    }
)(GeneralList);
