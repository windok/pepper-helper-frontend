import RestClient from '../../../services/RestClient';
import { normalize, schema } from 'normalizr';

const productSchema = new schema.Entity('product');

class ProductMapper {
    fetchProductCollection() {
        // todo response formatting and parsing
        // todo error processing
        return RestClient.get('/product').then(function(response) {
            return Promise.resolve(normalize(response.data, [productSchema]));
        });
    };

    addProduct(newProduct) {
        // todo product structure validation
        // todo response formatting and parsing
        // todo error processing
        return RestClient.post('/product', newProduct).then(function(response) {
            return Promise.resolve(normalize(response.data, productSchema));
        });
    };

    deleteProduct(productId) {
        // todo response formatting and parsing
        // todo error processing
        return RestClient.delete('/product/' + productId);
    };
}

// todo move to some factory or service locator
export default new ProductMapper();