import Entity from 'Models/Entity';
import {entityStructureFilter} from 'Models/entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class List extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'name'])
        ]);
    }

    getId() {
        return this.entity.id || this.getTmpId();
    }

    getTmpId() {
        return this.entity.tmpId;
    }

    getName() {
        return this.entity.name;
    }
}

class ListNullObject extends Nullable(List) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            name: 'n/a'
        });
    }
}

export default List;
export {List, ListNullObject};
