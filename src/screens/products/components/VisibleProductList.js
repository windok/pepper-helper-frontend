import ProductList from '../components/ProductList';
import {connect} from 'react-redux';

import {fetchProductCollection, deleteProduct} from '../actions/api'

const mapStateToProps = (state) => {
    return {
        // todo to much knowledge about inner state, refactor
        productCollection: state.product.all.ids.map((productId) => {
            return state.product.productStorage[productId]
        }),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductCollection: () => dispatch(fetchProductCollection()),
        onDeleteProductHandler: (id) => dispatch(deleteProduct(id))
    }
};

const VisibleProductList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductList);

export default VisibleProductList;