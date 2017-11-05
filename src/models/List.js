import Entity from 'Models/Entity';
import {entityStructureFilter} from 'Models/entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class List extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'name', 'color'])
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getTmpId() {
        return this.entity.tmpId;
    }

    getIdentifier() {
        return this.getId() || this.getTmpId()
    }

    getName() {
        return this.entity.name;
    }

    getColor() {
        return this.entity.color;
    }
}

class ListNullObject extends Nullable(List) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            name: 'n/a',
            color: ''
        });
    }
}

export default List;
export {List, ListNullObject};
