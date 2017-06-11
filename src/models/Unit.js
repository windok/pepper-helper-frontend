import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Unit extends NotNullable(Entity) {
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

class UnitNullObject extends Nullable(Unit) {
    constructor() {
        super(0, 'n/a');
    }
}

export default Unit;
export {Unit, UnitNullObject};
