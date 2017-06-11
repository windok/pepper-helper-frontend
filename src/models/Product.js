import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Product extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            () => entityStructureFilter(entity, ['id', 'name'])
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getName() {
        return this.entity.name;
    }
}

class ProductNullObject extends Nullable(Product) {
    constructor() {
        super(0, 'n/a');
    }
}

export default Product;
export {Product, ProductNullObject};
