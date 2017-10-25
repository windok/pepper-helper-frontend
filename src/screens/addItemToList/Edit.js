import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {editItem, deleteItem} from 'Actions/listItem';

import {ListItem} from 'Models/ListItem';
import {List} from 'Models/List';
import Product from "Models/Product";

import {getList} from 'Reducers/list';
import {getListItem} from 'Reducers/listItem';
import {getProduct} from 'Reducers/product';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import DeleteButton from 'Components/buttons/DeleteButton';
import {SaveButton} from 'Components/buttons/Button';

import Divider from 'react-md/lib/Dividers';

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

        if (listItem.getIdentifier() !== this.props.listItem.getIdentifier()) {
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
                    rightLinks={<SaveButton onClick={() => this.props.saveItemHandler(this.state.listItem)}/>}
                />

                {this.state.listItem && (
                    <div>
                        <ItemCard listItem={this.state.listItem}
                                  onListItemFieldChange={this.onTemplateFieldChange.bind(this)}
                        />

                        <Divider style={{marginTop: 40, marginBottom: 40}}/>

                        <DeleteButton text="Delete item" onClick={() => this.props.delete(this.props.listItem)}/>
                    </div>
                )}
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
    delete: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listItem = getListItem(state, match.params.itemId);
        const list = getList(state, match.params.listId);

        return {
            product: getProduct(state, listItem.getProductId()),
            listItem,
            list
        }
    },
    (dispatch, {history}) => {
        return {
            redirectToList: (list) => {
                list.isNullObject() ? history.push('/') : history.push('/product-list/' + list.getIdentifier());
            },
            saveItemHandler: (itemData) => {
                const listItem = new ListItem(itemData);

                history.push('/product-list/' + listItem.getListId());

                editItem(listItem)(dispatch);
            },
            delete: (item) => deleteItem(item)(dispatch)
        }
    }
)(EditListItem));
