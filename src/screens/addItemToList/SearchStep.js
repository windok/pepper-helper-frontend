import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import {searchProduct, createProduct} from 'Actions/product';
import {getList, getFirstList} from 'Reducers/list';
import {findProductByName} from 'Reducers/product';

import Divider from 'react-md/lib/Dividers';

import Header from 'Components/Header';
import TextField from 'react-md/lib/TextFields';
import BackButton from 'Components/buttons/BackButton';
import Button from 'react-md/lib/Buttons';

import ProductSearchResultList from './components/ProductSearchResultList';

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

    render() {

        const listId = this.props.listId;

        const forwardToSaveButton = <Button flat onClick={() => {
            if (this.state.query.trim().length === 0) {
                return;
            }

            const product = this.props.findProductByName(this.state.query);

            if (product) {
                return this.props.postToSaveStep(product);
            }

            this.props.postToSaveStep(this.props.createProduct(this.state.query));
        }}>Add</Button>;

        return (
            <div>
                <Header
                    title={"Add item to `" + this.props.list.getName() + "`"}
                    leftLinks={<BackButton/>}
                    rightLinks={forwardToSaveButton}
                />

                <form className="md-grid">
                    <TextField
                        id="query"
                        label="Search for products"
                        className="md-cell md-cell--12"
                        defaultValue={this.state.query}
                        autoComplete="off"
                        onChange={(value) => this.onQueryChange(value)}
                    />

                    <Divider style={{marginTop: 10, marginBottom: 10}}/>

                    <ProductSearchResultList listId={listId} query={this.state.query}/>
                </form>
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
        const listId = match.params.listId || 0;

        const list = listId ? getList(state, listId) : getFirstList(state);

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
                return history.push('/product-list/' + match.params.listId + '/item/save/' + product.getIdentifier());
            }
        }
    }
)(AddItemToListSearchStep));
