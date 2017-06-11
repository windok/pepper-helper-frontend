import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/List';

class ProductList extends React.PureComponent {
    componentWillMount() {
        this.props.fetchListItems(this.props.productList);
    }

    shouldComponentUpdate({productList}) {
        if (productList.getId() === this.props.productList.getId()) {
            return false;
        }

        this.props.fetchListItems(productList);

        return true;
    }

    render() {
        const listId = this.props.productListId;

        // todo create separate component that specifies Menu
        // todo keep list of links for each screen somewhere
        const headerLeftLinks = [
            <HeaderLink title={'Menu'} onClickHandler={() => {
            }}/>
        ];

        if (this.props.productList.isNullObject()) {
            return (
                <div>
                    <Sidebar/>
                    <Header title={"Product list " + this.props.productListName} leftLinks={headerLeftLinks}/>
                    {this.props.productListName}
                </div>
            );
        }

        // todo add item and recommendation links should be FAB
        return (
            <div>
                <Sidebar/>
                <Header title={"Product list " + this.props.productListName} leftLinks={headerLeftLinks}/>

                <ListComponent productListId={listId}/>
                <br/>
                <Link to={"/product-list/" + listId + "/recommendations"}>Show recommendations</Link>
                <br/>
                <Link to={"/product-list/" + listId + "/add-item/search"}>Add item</Link>
            </div>
        )
    }
}

ProductList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productList: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const productListId = parseInt(match.params.productListId);

        if (
            // todo incorrect route that leads to this page
        // todo maybe open some default list?
        !productListId
        // todo list fetching request in progress
        // todo maybe this list does not exist?
        || !state.storage.list.items.size
        // todo list fetching request in progress
        // todo maybe this list does not exist?
        // todo unexisted list, redirect to user's default list
        || !state.storage.list.items.has(productListId)
        ) {
            return {
                productListId: 0,
                productList: new ListNullObject()
            }
        }

        const productList = state.storage.list.items.get(productListId);

        return {
            productListId,
            productList
        }
    },
    (dispatch) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch)
        }
    }
)(ProductList));
