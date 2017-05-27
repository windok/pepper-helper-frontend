import React from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class ProductList extends React.PureComponent {
    render() {

        let productListId;

        try {
            productListId = this.props.match.params.productListId;
        } catch (e) {
            // todo get id of default list
            productListId = 0;
        }

        return (
            <div>
                {productListId ? "Product list " + productListId : "Default product list"}
                <ul>
                    <li>Apple</li>
                    <li>Banana</li>
                    <li>Orange</li>
                </ul>
            </div>
        )
    }
}


ProductList.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(ProductList);
