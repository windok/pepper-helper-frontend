import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {searchProductTranslation} from 'Actions/translation';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Input from 'Components/form/Input';

import  ProductSearchResultList from './components/ProductSearchResultList';

class AddItemToList extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            query: ''
        };

        this.onQueryChange.bind(this);
    }

    onQueryChange(newQuery) {
        this.setState({query: newQuery});

        this.props.searchHandler(newQuery);
    }

    // todo move action links to header
    render() {
        const listId = this.props.productListId;

        return (
            <div>
                <Header title={"Add item to " + this.props.productListName}/>
                <div onClick={this.props.cancelHandler} style={{cursor: 'pointer'}}>Cancel</div>

                <Input label="Search"
                       defaultValue={this.state.query}
                       onChange={(value) => this.onQueryChange(value)}/>
                <ProductSearchResultList productListId={listId} query={this.state.query}/>
            </div>
        )
    }
}

AddItemToList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productListName: PropTypes.string.isRequired,
    cancelHandler: PropTypes.func.isRequired,
    searchHandler: PropTypes.func.isRequired
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
                productListName: 'Unexisted list, redirect to default'
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
    (dispatch, {history}) => {
        return {
            cancelHandler: history.goBack,
            searchHandler: (query) => searchProductTranslation(query)(dispatch),
        }
    }
)(AddItemToList));
