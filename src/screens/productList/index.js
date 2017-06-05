import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';

import {fetchItemsForList} from 'Actions/listItem';

import List from './components/List';

class ProductList extends React.PureComponent {
    componentWillMount() {
        this.props.fetchListItems(this.props.productListId);
    }

    shouldComponentUpdate({productListId}) {
        if (productListId === this.props.productListId) {
            return false;
        }

        this.props.fetchListItems(productListId);

        return true;
    }

    render() {
        const listId = this.props.productListId;

        // todo create separate component that specifies Menu
        // todo keep list of links for each screen somewhere
        const headerLeftLinks = [
            <HeaderLink title={'Menu'} onClickHandler={() => {}}/>
        ];

        if (!listId || listId === '0') {
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

                <List productListId={listId}/>
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
    productListName: PropTypes.string.isRequired,
    fetchListItems: PropTypes.func.isRequired,
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
                productListName: 'Incorrect request to show list'
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
            fetchListItems: (listId) => fetchItemsForList(listId)(dispatch)
        }
    }
)(ProductList));
