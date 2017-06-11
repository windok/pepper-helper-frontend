import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import {searchProductTranslation, createProductTranslation} from 'Actions/product';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Input from 'Components/form/Input';

import  ProductSearchResultList from './components/ProductSearchResultList';

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

        this.props.searchHandler(newQuery);
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

        return (
            <div>
                <Header title={"Add item to " + this.props.list.getName()}/>
                <div onClick={this.props.cancelHandler} style={{cursor: 'pointer'}}>Cancel</div>
                <div onClick={() => {
                    if (this.state.query.trim().length === 0) {
                        return;
                    }

                    let internalTranslationWasFound = false;

                    Object.keys(this.props.searchResults).forEach(query => {
                        if (!internalTranslationWasFound && this.state.query.includes(query)) {
                            this.props.searchResults[query].forEach((productId) => {
                                if (!internalTranslationWasFound && this.props.productCollection.get(productId).getName() === this.state.query) {
                                    internalTranslationWasFound = true;

                                    this.props.postToSaveStepHandler(productId);
                                }
                            });
                        }
                    });

                    {/*if (!internalTranslationWasFound) {*/}
                        {/*this.props.createTranslationHandler(this.state.query)*/}
                            {/*.then((createdTranslation) => {*/}
                                {/*this.props.postToSaveStepHandler(createdTranslation.id);*/}
                            {/*})*/}
                    {/*}*/}
                }}
                     style={{cursor: 'pointer'}}>Create
                </div>

                <Input label="Search"
                       defaultValue={this.state.query}
                       onChange={(value) => this.onQueryChange(value)}/>
                <ProductSearchResultList productListId={listId} query={this.state.query}/>
            </div>
        )
    }
}

AddItemToListSearchStep.propTypes = {
    listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    list: PropTypes.instanceOf(ListModel).isRequired,

    productCollection: PropTypes.instanceOf(Map),
    searchResults: PropTypes.object,

    cancelHandler: PropTypes.func.isRequired,
    searchHandler: PropTypes.func.isRequired,
    postToSaveStepHandler: PropTypes.func.isRequired,
    createTranslationHandler: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId);

        if (
            // todo incorrect route that leads to this page
        // todo maybe open some default list?
        !listId
        // todo list fetching request in progress
        // todo maybe this list does not exist?
        || !state.storage.list.items.size
        // todo list fetching request in progress
        // todo maybe this list does not exist?
        // todo unexisted list, redirect to user's default list
        || !state.storage.list.items.has(listId)
        ) {
            return {
                listId: 0,
                list: new ListNullObject()
            }
        }

        const list = state.storage.list.items.get(listId);

        return {
            listId,
            list,
            productCollection: state.storage.product.items,
            searchResults: state.storage.product.searchResults
        }
    },
    (dispatch, {match, history}) => {
        return {
            cancelHandler: history.goBack,
            searchHandler: (query) => searchProductTranslation(query)(dispatch),
            createTranslationHandler: (value) => createProductTranslation(value)(dispatch),
            postToSaveStepHandler: (translationId) => {
                return history.push('/product-list/' + match.params.listId + '/add-item/save/' + translationId);
            }
        }
    }
)(AddItemToListSearchStep));
