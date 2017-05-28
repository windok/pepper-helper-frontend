import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {fetchListItems} from 'Actions';

import List from './components/List';

class ProductList extends React.PureComponent {
    render() {
        return (
            <div>
                {"Product list " + this.props.productListName}
                <List productListId={this.props.productListId}/>
            </div>
        )
    }
}

ProductList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productListName: PropTypes.string.isRequired,
    fetchListItems: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, ownProps) => {
        const match = ownProps.match;

        const productListId = match.params.productListId;

        if (!productListId) {
            // todo incorrect route that leads to this page
            // todo maybe open some default list?
            return {
                productListId: 0,
                productListName: 'Incorrect request to show list',
                listItems: []
            }
        }


        if (state.storage.list.data[productListId] === undefined) {
            // todo list fetching request in progress
            // todo maybe this list does not exist?
            return {
                productListId: 0,
                productListName: 'Fetching list items',
                listItems: []
            }
        }

        const productList = state.storage.list.data[productListId];

        return {
            productListId,
            productListName: productList.name,
            listItems: productList.listItems.map((listItemId) => {
                return state.storage.listItem[listItemId];
            })
        }
    },
    (dispatch) => {
        // fetchListItems(match.params.productListId)(dispatch);
        return {
            fetchListItems: (listId) => fetchListItems(listId)(dispatch)
        }
    }
)(ProductList));
