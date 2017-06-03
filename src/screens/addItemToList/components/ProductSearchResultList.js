import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class ProductSearchResultList extends React.PureComponent {
    render() {
        if (this.props.searchResults.length === 0) {
            return (<div>No items were found.</div>);
        }

        return (
            <div>
                <ul>
                    {this.props.searchResults.map((searchProduct) =>
                        <Link to={"/product-list/" + this.props.productListId + "/add-item/save/" + searchProduct.id} key={searchProduct.id}>
                            <button>{searchProduct.value}</button>
                        </Link>
                    )}
                </ul>
            </div>
        )
    }
}

ProductSearchResultList.propTypes = {
    productListId: PropTypes.any.isRequired,
    query: PropTypes.string.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        value: PropTypes.string.isRequired,
    })).isRequired
};

export default connect(
    (state, {productListId, query}) => {
        return {
            productListId,
            query,
            searchResults : state.storage.translation.searchProductResults[query] || []
        }
    }
)(ProductSearchResultList);
