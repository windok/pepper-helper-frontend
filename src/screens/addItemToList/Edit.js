import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {editItem} from 'Actions/listItem';

import {ListItem} from 'Models/ListItem';
import {List} from 'Models/List';
import Product from "Models/Product";

import {getList} from 'Reducers/list';
import {getListItem} from 'Reducers/listItem';
import {getProduct} from 'Reducers/product';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';

import ItemCard from './components/ItemCard';

class EditListItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            listItem: {...props.listItem.serialize(), name: props.product.getName()}
        };
    }

    componentWillMount() {
        this.redirectToListIfNecessary(this.props.listItem);

    }

    componentWillReceiveProps({listItem, product}) {
        this.redirectToListIfNecessary(listItem);

        if (listItem.getId() !== this.props.listItem.getId()) {
            this.setState({
                listItem: {...listItem.serialize(), name: product.getName()}
            });
        }
    }

    redirectToListIfNecessary(listItem) {
        if (listItem.isNullObject()) {
            this.props.redirectToList(this.props.list);
        }
    }

    onTemplateFieldChange(field, value) {
        this.setState({
            listItem: {...this.state.listItem, [field]: value}
        });
    }

    render() {
        return (
            <div>
                <Header
                    title={'Edit item'}
                    leftLinks={<BackButton iconType="clear"/>}
                    rightLinks={<SaveButton onTouchTap={() => this.props.saveItemHandler(this.state.listItem)}/>}
                />

                {this.state.listItem
                && <ItemCard listItem={this.state.listItem}
                             onListItemFieldChange={this.onTemplateFieldChange.bind(this)}
                />}
            </div>
        )
    }
}

EditListItem.propTypes = {
    listItem: PropTypes.instanceOf(ListItem).isRequired,
    list: PropTypes.instanceOf(List).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,

    redirectToList: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listItem = getListItem(state, parseInt(match.params.itemId) || 0);
        const list = getList(state, parseInt(match.params.listId) || 0);

        return {
            product: getProduct(state, listItem.getProductId()),
            listItem,
            list
        }
    },
    (dispatch, {history}) => {
        return {
            redirectToList: (list) => {
                list.isNullObject() ? history.push('/') : history.push('/product-list/' + list.getId());
            },
            saveItemHandler: (itemData) => {
                const listItem = new ListItem(itemData);

                history.push('/product-list/' + listItem.getListId());

                editItem(listItem)(dispatch);
            },
        }
    }
)(EditListItem));
