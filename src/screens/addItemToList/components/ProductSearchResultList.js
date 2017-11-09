import React from 'react';
import PropTypes from 'prop-types';
import history from 'Services/BrowserHistory';
import {connect} from 'react-redux';

import ProductModel from 'Models/Product';
import ListModel from 'Models/List';

import Chip from 'react-md/lib/Chips';
import FontIcon from 'react-md/lib/FontIcons';
import Avatar from 'react-md/lib/Avatars';

import {findBestSearchResults} from 'Reducers/product';

class ProductSearchResultList extends React.PureComponent {
    render() {
        if (this.props.searchResults.length === 0) {
            return (<div className="md-text-center md-cell--12" style={{color: '#888'}}>
                <span className="text-with-icon"><FontIcon>error_outline</FontIcon>No items were found.</span>
            </div>);
        }

        return (
            <div className="chips__list">
                {this.props.searchResults.map((product) => (
                    <Chip
                        key={product.getIdentifier()}
                        label={product.getName()}
                        avatar={<Avatar random>{product.getName()[0]}</Avatar>}
                        onClick={() => this.props.postToSaveStep(product)}
                    />
                ))}
            </div>
        )
    }
}

ProductSearchResultList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    query: PropTypes.string.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.instanceOf(ProductModel)).isRequired,

    postToSaveStep: PropTypes.func.isRequired,
};

export default connect(
    (state, {query}) => ({
        searchResults: query.length >= 2 ? findBestSearchResults(state, query) : []
    }),
    (dispatch, {list}) => ({
        postToSaveStep: (product) => {
            return history.push(`/product-list/${list.getIdentifier()}/item/save/${product.getIdentifier()}`);
        }
    })
)(ProductSearchResultList);
