import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Group extends NotNullable(Entity) {
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

class GroupNullObject extends Nullable(Group) {
    constructor() {
        super(0, 'n/a');
    }
}

export default Group;
export {Group, GroupNullObject};
