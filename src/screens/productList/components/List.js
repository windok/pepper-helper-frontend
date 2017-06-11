import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {ListNullObject} from 'Models/List';
import {ListItem} from 'Models/ListItem';

import Item from './Item';

class List extends React.PureComponent {
    render() {
        return (
            <div>
                <ul>
                    {this.props.listItems.map(
                        listItem => <li key={listItem.getId()}><Item listItem={listItem}/></li>
                    )}
                </ul>
            </div>
        )
    }
}

List.propTypes = {
    productListId: PropTypes.any.isRequired,
    listItems: PropTypes.arrayOf(PropTypes.instanceOf(ListItem)).isRequired
};

export default connect(
    (state, {productListId}) => {
        const productList = state.storage.list.items.get(productListId) || new ListNullObject();

        return {
            productListId,
            listItems: productList.getItems().map(itemId => state.storage.listItem.items.get(itemId))
        }
    }
)(List);
