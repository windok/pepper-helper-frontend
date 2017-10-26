import Entity from './Entity';
import {entityStructureFilter, allowedValuesValidator} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

const TYPE_USA = 'usa';
const TYPE_INTERNATIONAL = 'international';
const TYPE_INTERNATIONAL_RU = 'international-ru';

class Unit extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'name', 'type']),
            (entity) => allowedValuesValidator(entity, 'type', [TYPE_USA, TYPE_INTERNATIONAL, TYPE_INTERNATIONAL_RU]),
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

    getType() {
        return this.entity.type
    }
}

class UnitNullObject extends Nullable(Unit) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            name: 'n/a',
            type: TYPE_USA
        });
    }
}

export default Unit;
export {
    Unit,
    UnitNullObject,
    TYPE_USA,
    TYPE_INTERNATIONAL,
    TYPE_INTERNATIONAL_RU
};
