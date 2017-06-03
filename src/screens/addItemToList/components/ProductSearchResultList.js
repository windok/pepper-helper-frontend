import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class ProductSearchResultList extends React.PureComponent {
    render() {

        console.log(this.props);

        if (this.props.searchResults.length === 0) {
            return (<div>No items were found.</div>);
        }

        return (
            <div>
                <ul>
                    {this.props.searchResults.map((searchProduct) =>
                        <button key={searchProduct.id}>{searchProduct.value}</button>
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

        let searchResults;

        console.log(state.storage.translation.searchProductResults);
        try {
            searchResults = state.storage.translation.searchProductResults[query] || [];
        } catch (e) {
            searchResults = [];
        }

        return {
            productListId,
            query,
            searchResults
        }
    }
)(ProductSearchResultList);
