import React, {Component, PropTypes} from 'react';

class AddProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameValue: ''
        };
    }

    componentDidMount() {
        // todo focus on text field
    }

    handleNameChange = (event) => {
        this.setState({
            nameValue: event.target.value
        });
    };

    onClickAddButton() {
        if (this.state.nameValue === '') {
            return;
        }

        this.props.handleNewProduct(this.state.nameValue);

        this.setState({
            nameValue: ''
        });
    }

    render() {
        // todo add by pressing Enter
        return (
            <div>
                <input
                    type="text"
                    value={this.state.nameValue}
                    placeholder="Enter product name"
                    onChange={this.handleNameChange}
                />
                <button onClick={this.onClickAddButton.bind(this)}>ADD</button>
            </div>
        )
    }

}

AddProduct.propTypes = {
    handleNewProduct: PropTypes.func.isRequired
};

export default AddProduct;

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