import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {getList} from 'Reducers/storage/list';
import {getListItemCollectionForList} from 'Reducers/storage/listItem';

import Item from './Item';

class List extends React.PureComponent {
    render() {
        const liElements = [];
        this.props.listItems.forEach(listItem => liElements.push(
            <li key={listItem.getId()}><Item listItem={listItem}/></li>
        ));

        return (
            <div>
                <ul>{liElements}</ul>
            </div>
        )
    }
}

List.propTypes = {
    productListId: PropTypes.any.isRequired,
    listItems: PropTypes.instanceOf(Map).isRequired
};

export default connect(
    (state, {productListId}) => {
        return {
            productListId,
            listItems: getListItemCollectionForList(state, getList(state, productListId))
        }
    }
)(List);
