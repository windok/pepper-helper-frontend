import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class ProductSearchResultList extends React.PureComponent {
    render() {
        if (this.props.searchResults.length === 0) {
            return (<div>No items were found. </div>);
        }

        return (
            <div>
                <ul>
                    {this.props.searchResults.map((productId) =>
                        <Link to={"/product-list/" + this.props.listId + "/add-item/save/" + productId} key={productId}>
                            <button>{this.props.productCollection.get(productId).getName()}</button>
                        </Link>
                    )}
                </ul>
            </div>
        )
    }
}

ProductSearchResultList.propTypes = {
    listId: PropTypes.any.isRequired,
    query: PropTypes.string.isRequired,
    productCollection: PropTypes.instanceOf(Map).isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default connect(
    (state, {productListId, query}) => {
        return {
            listId: productListId,
            query,
            productCollection: state.storage.product.items,
            searchResults : state.storage.product.searchResults[query] || []
        }
    }
)(ProductSearchResultList);
