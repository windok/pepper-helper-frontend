import React from 'react';

import AddProduct from './containers/AddProduct';
import VisibleProductList from './containers/VisibleProductList';

const ProductApp = () => (
    <div>
        <AddProduct/>
        <VisibleProductList/>
    </div>
);

export default ProductApp;