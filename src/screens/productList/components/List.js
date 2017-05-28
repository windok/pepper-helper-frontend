import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import Item from './Item';

class List extends React.PureComponent {
    render() {
        return (
            <div>
                <ul>
                    {this.props.listItems.map((listItem) =>
                    <li key={listItem.id}><Item id={listItem.id} name={listItem.translationId}/></li>
                    )}
                    </ul>
            </div>
        )
    }
}

List.propTypes = {
    productListId: PropTypes.any.isRequired,
    listItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        translationId: PropTypes.any.isRequired
    })).isRequired
};

export default connect(
    (state, {productListId}) => {
        const productList = state.storage.list.data[productListId];

        const listItems = productList ? productList.listItems.map((listItemId) => state.storage.listItem[listItemId]) : [];

        return {
            productListId,
            listItems
        }
    }
)(List);
