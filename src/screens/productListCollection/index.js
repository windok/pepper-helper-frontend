import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';


class ProductListCollection extends React.PureComponent {
    render() {
        return (
            <div>
                Lists:
                <ul>
                {
                    Object.keys(this.props.lists).map(
                        (listId) => <li key={listId}><Link to={"/product-list/" + listId}>{this.props.lists[listId].name}</Link></li>
                    )
                }
                </ul>
            </div>
        );
    }
}

ProductListCollection.propTypes = {
    lists: PropTypes.object.isRequired
};

const WrappedProductListCollection = connect(
    (state) => {
        return {
            lists: state.storage.list.data
        }
    })(ProductListCollection);

export default WrappedProductListCollection;