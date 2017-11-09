import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {getTemplate, createItem} from 'Actions/listItem';

import {List, ListNullObject} from 'Models/List';
import {ListItem, ListItemNullObject, STATUS_DRAFT} from 'Models/ListItem';
import {Product, ProductNullObject} from 'Models/Product';

import {getList} from 'Reducers/list';
import {getProduct} from 'Reducers/product';
import {getTemplate as getListItemTemplate, getItemsByListAndProduct} from 'Reducers/listItem';

import {ensureListExists} from 'Components/EnsureListExists';
import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';

import ItemCard from './components/ItemCard';

class AddItemToListSaveStep extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            template: this.props.template ? {...this.props.template.serialize(), name: props.product.getName()} : null
        };
    }

    componentWillMount() {
        if (!this.redirectToItemEditScreenIfPossible(this.props.template)) {
            this.props.getTemplate(this.props.list, this.props.product);
        }
    }

    componentWillReceiveProps({list, product, template}) {
        if (this.redirectToItemEditScreenIfPossible(template)) {
            return;
        }

        if (this.props.list.getIdentifier() !== list.getIdentifier() || this.props.product.getIdentifier() !== product.getIdentifier()) {
            this.props.getTemplate(list, product);
        }

        if (template && (
                // if there were no template before
                !this.props.template
                // or if list or product has changed
                || template.getListId() !== this.props.template.getListId()
                || template.getProductId() !== this.props.template.getProductId()
            )) {

            this.setState({
                template: {...template.serialize(), name: product.getName()}
            });
        }
    }

    redirectToItemEditScreenIfPossible(template) {
        if (!template || !template.getId()) {
            return false;
        }

        this.props.redirectToItemEdit(template);

        return true;
    }

    onTemplateFieldChange(field, value) {
        this.setState({
            template: {...this.state.template, [field]: value}
        });
    }

    render() {
        return (
            <div>
                <Header
                    title={"Add item to `" + this.props.list.getName() + "`"}
                    leftLinks={<BackButton/>}
                    rightLinks={<SaveButton onClick={() => this.props.saveItemHandler(this.state.template)}/>}
                />

                {this.state.template
                &&
                <ItemCard
                    listItem={this.state.template}
                    onListItemFieldChange={this.onTemplateFieldChange.bind(this)}
                />
                }
            </div>
        )
    }
}

AddItemToListSaveStep.propTypes = {
    list: PropTypes.instanceOf(List).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    template: PropTypes.instanceOf(ListItem),

    saveItemHandler: PropTypes.func.isRequired,
    redirectToItemEdit: PropTypes.func.isRequired,
    getTemplate: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => {
        const productId = match.params.productId;

        const list = getList(state, match.params.listId);

        const product = getProduct(state, productId);

        const matchingListItems = getItemsByListAndProduct(state, list, product)
            .filter((listItem) => listItem.getStatus() === STATUS_DRAFT);

        const template = matchingListItems.length
            ? matchingListItems[0]
            : getListItemTemplate(state, list, product);

        return {
            list,
            product,
            template,
        }
    },
    (dispatch, {history}) => {
        return {
            saveItemHandler: (template) => {
                history.push('/product-list/' + template.listId);
                createItem(new ListItem(template))(dispatch);
            },
            redirectToItemEdit: (item) => history.replace(`/product-list/${item.getListId()}/item/${item.getIdentifier()}`),
            getTemplate: (list, product) => getTemplate(list, product)(dispatch)
        }
    }
)(ensureListExists(AddItemToListSaveStep)));
