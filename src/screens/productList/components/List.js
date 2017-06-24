import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';
import Item from './Item';

import {getDraftListItems, getBoughtListItems} from 'Reducers/storage/listItem';

class List extends React.PureComponent {
    render() {
        const draftItems = [];
        const boughtItems = [];

        this.props.draftListItems.forEach(listItem => draftItems.push(
            <ListItemComponent key={listItem.getId()}><Item listItem={listItem}/></ListItemComponent>
        ));

        this.props.boughtListItems.forEach(listItem => boughtItems.push(
            <ListItemComponent key={listItem.getId()}><Item listItem={listItem}/></ListItemComponent>
        ));

        return (
            <div>
                <ListComponent>{draftItems}</ListComponent>
                <div>Bought:</div>
                <ListComponent>{boughtItems}</ListComponent>
            </div>
        );
    }
}

List.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    draftListItems: PropTypes.instanceOf(Map).isRequired,
    boughtListItems: PropTypes.instanceOf(Map).isRequired
};

export default connect(
    (state, {list}) => {
        return {
            list,
            draftListItems: getDraftListItems(state, list),
            boughtListItems: getBoughtListItems(state, list)
        }
    }
)(List);
