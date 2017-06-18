import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {getTemplate, createItem} from 'Actions/listItem';

import {List, ListNullObject} from 'Models/List';
import {ListItem, ListItemNullObject, CustomProductListItemTemplate} from 'Models/ListItem';
import {Product, ProductNullObject} from 'Models/Product';

import {getList} from 'Reducers/storage/list';
import {getProduct} from 'Reducers/storage/product';
import {getTemplate as getListItemTemplate} from 'Reducers/storage/listItem';

import Header from 'Components/Header';
import HeaderLink from 'Components/HeaderLink';
import Input from 'Components/form/Input';

import UnitSelect from './components/UnitSelect';
import GroupSelect from './components/GroupSelect';
import BackButton from './components/buttons/BackButton';

class AddItemToListSaveStep extends React.PureComponent {
    constructor(props) {
        super(props);

        // todo bind template changes to redux state instead component one
        this.state = {
            template: props.template ? props.template.serialize() : null
        };

        this.onTemplateFieldChange.bind(this);
    }

    componentWillMount() {
        this.props.getTemplate(this.props.list, this.props.product);
    }

    shouldComponentUpdate({listId, productId, list, product}) {
        if (this.props.listId !== listId || this.props.productId !== productId) {
            this.props.getTemplate(list, product);
        }

        return true;
    }

    componentDidUpdate({template}) {
        // todo bind template changes to redux state instead component one
        if (
            // if there were no template before
            (this.props.template && !template)
                // or if list or product was changed
            || (
                this.props.template
                && this.props.template.getListId() !== template.getListId()
                && this.props.template.getProductId() !== template.getProductId()
            )
        ) {
            this.setState({template: this.props.template.serialize()});
        }
    }

    onTemplateFieldChange(field, value) {
        this.setState({
            template: {...this.state.template, [field]: value}
        });
    }

    render() {
        if (!this.state.template) {
            return <div></div>
        }

        // todo move action links to header
        return (
            <div>
                <Header title={"Add item to " + this.props.list.getName()} leftLinks={[<BackButton key="1" history={this.props.history}/>]}/>
                <Link to={"/product-list/" + this.props.listId}
                      onClick={() => this.props.saveItemHandler(this.state.template)}>Save</Link>

                <GroupSelect groupId={this.state.template.groupId}
                             onGroupChange={(groupId) => this.onTemplateFieldChange('groupId', groupId)}/>

                <UnitSelect unitId={this.state.template.unitId}
                            onUnitChange={(unitId) => this.onTemplateFieldChange('unitId', unitId)}/>

                <Input label="Quantity"
                       defaultValue={this.state.template.quantity}
                       onChange={(value) => this.onTemplateFieldChange('quantity', value)}/>
            </div>
        )
    }
}

AddItemToListSaveStep.propTypes = {
    listId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    list: PropTypes.instanceOf(List).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    template: PropTypes.instanceOf(ListItem),

    saveItemHandler: PropTypes.func.isRequired,
    getTemplate: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId);
        const productId = parseInt(match.params.productId);

        // todo consider to use global state in selector instead of passing it as param
        const list = getList(state, listId);
        const product = getProduct(state, productId);

        if (list.isNullObject() || product.isNullObject()) {
            return {
                listId: 0,
                productId: 0,
                list: list,
                product: product,
                template: null,
            }
        }

        return {
            listId,
            productId,
            list,
            product,
            template: getListItemTemplate(state, list, product),
        }
    },
    (dispatch, {history}) => {
        return {
            saveItemHandler: (template) => createItem(new ListItem(template))(dispatch),
            getTemplate: (list, product) => getTemplate(list, product)(dispatch)
        }
    }
)(AddItemToListSaveStep));
