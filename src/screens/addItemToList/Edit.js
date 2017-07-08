import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {editItem} from 'Actions/listItem';

import {ListItem, ListItemNullObject, STATUS_DRAFT} from 'Models/ListItem';
import {List} from 'Models/List';

import {getList} from 'Reducers/storage/list';
import {getListItem} from 'Reducers/storage/listItem';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';

import ItemCard from './components/ItemCard';

class EditListItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            listItem: props.listItem.serialize()
        };
    }

    componentWillMount() {
        this.redirectToListIfNecessary(this.props.listItem);

    }

    componentWillReceiveProps({listItem}) {
        this.redirectToListIfNecessary(listItem);

        if (listItem.getId() !== this.props.listItem.getId()) {
            this.setState({
                listItem: listItem.serialize()
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
                    leftLinks={<BackButton/>}
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

    redirectToList: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listItem = getListItem(state, parseInt(match.params.itemId) || 0);
        const list = getList(state, parseInt(match.params.listId) || 0);

        return {listItem, list}
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
