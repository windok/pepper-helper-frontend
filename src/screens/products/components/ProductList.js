import React, {Component, PropTypes} from 'react';

import Product from './Product';

class ProductList extends Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.props.fetchProductCollection();
    }

    render() {
        return (
            <div>
                {this.props.productCollection.map((product) => (
                    <div key={product.id}>
                        <Product id={product.id} name={product.name} state={product.state}/>
                        <button onClick={() => this.props.onDeleteProductHandler(product.id)}>DELETE</button>
                    </div>
                ))}
            </div>
        )
    }
}

ProductList.propTypes = {
    productCollection: PropTypes.array.isRequired,
    fetchProductCollection: PropTypes.func.isRequired,
    onDeleteProductHandler: PropTypes.func.isRequired
};

export default ProductList;