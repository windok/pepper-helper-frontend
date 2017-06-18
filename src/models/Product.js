import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Product extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'name', 'defaultName', 'userId'])
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getName() {
        return this.entity.name || this.entity.defaultName;
    }

    getUserId() {
        return parseInt(this.entity.userId);
    }

    isCustom() {
        return this.getUserId() > 0;
    }
}

class ProductNullObject extends Nullable(Product) {
    constructor() {
        super({id: 0, name: 'n/a', defaultName: 'n/a', userId: 0});
    }
}

export default Product;
export {Product, ProductNullObject};