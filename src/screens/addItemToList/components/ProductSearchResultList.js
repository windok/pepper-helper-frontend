import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {getProductCollection, findBestSearchResults} from 'Reducers/storage/product';

class ProductSearchResultList extends React.PureComponent {
    render() {
        if (this.props.searchResults.length === 0) {
            return (<div>No items were found. </div>);
        }

        return (
            <div>
                <ul>
                    {this.props.searchResults.map((productId) =>
                        <Link to={"/product-list/" + this.props.listId + "/item/save/" + productId} key={productId}>
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
    (state, {listId, query}) => {
        return {
            listId,
            query,
            productCollection: getProductCollection(state),
            searchResults: findBestSearchResults(state, query)
        }
    }
)(ProductSearchResultList);
