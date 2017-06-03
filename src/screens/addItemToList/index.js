import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'


class AddItemToList extends React.PureComponent {
    render() {
        const listId = this.props.productListId;

        return (
            <div>
                <Link to={"/product-list/" + listId} onClick={() => this.props.cancelHandler(listId)}>Cancel</Link>
                <br/>
                <Link to={"/product-list/" + listId} onClick={() => this.props.saveItemHandler(listId)}>Save</Link>
                <br/>
                Add item screen.
                Add item to {this.props.productListName}
                </div>
        )
    }
}

AddItemToList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productListName: PropTypes.string.isRequired,
    cancelHandler: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, ownProps) => {
        const match = ownProps.match;

        const productListId = match.params.productListId;

        if (!productListId || productListId === '0') {
            // todo incorrect route that leads to this page
            // todo maybe open some default list?
            return {
                productListId: 0,
                productListName: 'Unexisted list, redirect to default',
            }
        }

        if (state.storage.list.data.length === 0) {
            // todo list fetching request in progress
            // todo maybe this list does not exist?
            return {
                productListId: 0,
                productListName: 'Fetching lists'
            }
        }

        if (state.storage.list.data[productListId] === undefined) {
            // todo list fetching request in progress
            // todo maybe this list does not exist?
            return {
                productListId: 0,
                productListName: 'Unexisted list, redirect to default'
            }
        }

        const productList = state.storage.list.data[productListId];

        return {
            productListId,
            productListName: productList.name
        }
    },
    (dispatch) => {
        return {
            cancelHandler: (listId) => {},
            saveItemHandler: (listId) => {},
        }
    }
)(AddItemToList));
