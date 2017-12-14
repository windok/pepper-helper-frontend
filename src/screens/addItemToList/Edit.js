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

import {ensureListExists} from 'Components/EnsureListExists';
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
            listItem: {
                ...props.listItem.serialize(),
                name: props.product.getName()
            }
        };
    }

    componentWillReceiveProps({listItem, product}) {
        if (listItem.getIdentifier() !== this.props.listItem.getIdentifier()) {
            this.setState({
                listItem: {
                    ...listItem.serialize(),
                    name: product.getName()
                }
            });
        }
    }

    onTemplateFieldChange = (field, value) => {
        this.setState({
            listItem: {...this.state.listItem, [field]: value}
        });
    };

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
                                  onListItemFieldChange={this.onTemplateFieldChange}
                        />

                        <Divider style={{marginTop: 40, marginBottom: 40}}/>

                        <DeleteButton text="Delete item" onClick={() => this.props.delete(this.props.listItem)}/>
                    </div>
                )}
            </div>
        )
    }

    redirectToListIfNecessary() {
        if (this.props.listItem.isNullObject()) {
            this.props.redirectToList(this.props.list);
        }
    }

    componentDidMount() {
        this.redirectToListIfNecessary();
    }

    componentDidUpdate() {
        this.redirectToListIfNecessary();
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

        return {
            product: getProduct(state, listItem.getProductId()),
            list: getList(state, match.params.listId),
            listItem,
        }
    },
    (dispatch, {history}) => ({
        redirectToList: (list) => history.push('/product-list/' + list.getIdentifier()),
        saveItemHandler: (itemData) => {
            const listItem = new ListItem(itemData);

            history.push('/product-list/' + listItem.getListId());

            dispatch(editItem(listItem));
        },
        delete: (item) => dispatch(deleteItem(item))
    })
)(ensureListExists(EditListItem)));
