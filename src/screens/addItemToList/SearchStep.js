import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import {createProduct} from 'Actions/product';

import {getList} from 'Reducers/list';
import {findProductByName} from 'Reducers/product';

import Divider from 'react-md/lib/Dividers';

import {ensureListExists} from 'Components/EnsureListExists';
import Header from 'Components/Header';
import TextField from 'react-md/lib/TextFields';
import BackButton from 'Components/buttons/BackButton';
import Button from 'react-md/lib/Buttons';

import ProductSearchResultList from './components/ProductSearchResultList';

class AddItemToListSearchStep extends React.PureComponent {

    state = {
        query: ''
    };
    searchField = null;

    onQueryChange(newQuery) {
        this.setState({query: newQuery});
    }

    forwardToSaveStep = () => {
        const product = this.props.findProductByName(this.state.query) || this.props.createProduct(this.state.query);

        this.props.postToSaveStep(this.props.list, product);
    };

    render() {
        const forwardToSaveStepButton = this.state.query.trim().length
            ? <Button flat onClick={this.forwardToSaveStep}>Add</Button>
            : [];

        return (
            <div>
                <Header
                    title={"Add item to `" + this.props.list.getName() + "`"}
                    leftLinks={<BackButton/>}
                    rightLinks={forwardToSaveStepButton}
                />

                <form className="md-grid">
                    <TextField
                        id="query"
                        ref={field => this.searchField = field}
                        label="Search for products"
                        className="md-cell md-cell--12"
                        defaultValue={this.state.query}
                        autoComplete="off"
                        onChange={(value) => this.onQueryChange(value)}
                    />

                    <Divider style={{marginTop: 10, marginBottom: 10}}/>

                    {this.state.query && <ProductSearchResultList list={this.props.list} query={this.state.query}/>}
                </form>
            </div>
        )
    }

    componentDidMount() {
        this.searchField && this.searchField.focus();
    }
}

AddItemToListSearchStep.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    findProductByName: PropTypes.func,

    postToSaveStep: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => ({
        list: getList(state, match.params.listId),
        findProductByName: (name) => findProductByName(state, name),
    }),
    (dispatch, {history}) => ({
        createProduct: (value) => dispatch(createProduct(value)),
        postToSaveStep: (list, product) => {
            return history.push(`/product-list/${list.getIdentifier()}/item/save/${product.getIdentifier()}`);
        }
    })
)(ensureListExists(AddItemToListSearchStep)));
