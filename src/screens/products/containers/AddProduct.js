import AddProductRepresentation from '../components/AddProduct';
import {connect} from 'react-redux';

import {addProduct} from '../actions/api';

const AddProduct = connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return {
            handleNewProduct: (name) => {
                dispatch(addProduct(name))
            }
        }
    }
)(AddProductRepresentation);

export default AddProduct;