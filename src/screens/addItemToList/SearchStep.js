import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import {searchProduct, createProduct} from 'Actions/product';
import {getList} from 'Reducers/storage/list';
import {findProductByName} from 'Reducers/storage/product';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Input from 'Components/form/Input';

import ProductSearchResultList from './components/ProductSearchResultList';
import CloseButton from './components/buttons/CloseButton';
import ForwardToSaveButton from './components/buttons/ForwardToSaveButton';

class AddItemToListSearchStep extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            query: ''
        };

        this.onQueryChange.bind(this);
    }

    onQueryChange(newQuery) {
        this.setState({query: newQuery});

        this.props.searchProduct(newQuery);
    }

    // todo move action links to header
    render() {

        if (this.props.list.isNullObject()) {
            return (
                <div>
                    <Header title={"Add item to " + this.props.list.getName()}/>
                    <div onClick={this.props.cancelHandler} style={{cursor: 'pointer'}}>Cancel</div>
                </div>
            );
        }

        const listId = this.props.listId;

        const forwardToSaveButton = <ForwardToSaveButton onTouchTap={() => {
            if (this.state.query.trim().length === 0) {
                return;
            }

            const product = this.props.findProductByName(this.state.query);

            if (product) {
                return this.props.postToSaveStep(product);
            }

            // todo think how to refactor this
            this.props.createProduct(this.state.query)
                .then(product => this.props.postToSaveStep(product));
        }}/>;

        return (
            <div>
                <Header
                    title={"Add item to " + this.props.list.getName()}
                    leftLinks={<CloseButton history={this.props.history}/>}
                    rightLinks={forwardToSaveButton}
                />

                <Input label="Search"
                       defaultValue={this.state.query}
                       onChange={(value) => this.onQueryChange(value)}/>
                <ProductSearchResultList listId={listId} query={this.state.query}/>
            </div>
        )
    }
}

AddItemToListSearchStep.propTypes = {
    listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    list: PropTypes.instanceOf(ListModel).isRequired,

    findProductByName: PropTypes.func,

    searchProduct: PropTypes.func.isRequired,
    postToSaveStep: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId);

        const list = getList(state, listId);

        if (
        // todo incorrect route that leads to this page
        // todo maybe open some default list?
        !listId
        // todo list fetching request in progress
        // todo maybe this list does not exist?
        // todo unexisted list, redirect to user's default list
        || list.isNullObject()
        ) {
            return {listId: 0, list}
        }

        return {
            listId,
            list,
            findProductByName: (name) => findProductByName(state, name)
        }
    },
    (dispatch, {match, history}) => {
        return {
            searchProduct: (query) => searchProduct(query)(dispatch),
            createProduct: (value) => createProduct(value)(dispatch),
            postToSaveStep: (product) => {
                return history.push('/product-list/' + match.params.listId + '/add-item/save/' + product.getId());
            }
        }
    }
)(AddItemToListSearchStep));
