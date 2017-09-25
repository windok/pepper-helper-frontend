import React from 'react';
import PropTypes from 'prop-types';
import history from 'Services/BrowserHistory';
import {connect} from 'react-redux';

import Chip from 'react-md/lib/Chips';
import Avatar from 'react-md/lib/Avatars';

import {getProductCollection, findBestSearchResults} from 'Reducers/product';

class ProductSearchResultList extends React.PureComponent {
    render() {
        if (this.props.searchResults.length === 0) {
            return (<div>No items were found. </div>);
        }

        return (
            <div className="chips__list">
                {this.props.searchResults.map((productId) => {
                        const label = this.props.productCollection.get(productId).getName();
                        const link = `/product-list/${this.props.listId}/item/save/${productId}`;
                        return (
                            <Chip
                                key={productId}
                                label={label}
                                avatar={<Avatar random>{label[0]}</Avatar>}
                                onClick={() => this.props.addItem(link)}
                            />
                        );
                    }
                    // <Link to={} key={productId}>
                    //     <button></button>
                    // </Link>
                )}
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
    },
    {
        addItem: link => {
            history.push(link);
        }
    }
)(ProductSearchResultList);
