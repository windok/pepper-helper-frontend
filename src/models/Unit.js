import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Unit extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'name'])
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getTmpId() {
        return this.entity.tmpId;
    }

    getIdentifier() {
        return this.getId() || this.getTmpId();
    }

    getName() {
        return this.entity.name;
    }
}

class UnitNullObject extends Nullable(Unit) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            name: 'n/a'
        });
    }
}

export default Unit;
export {Unit, UnitNullObject};
