import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class Group extends NotNullable(Entity) {
    constructor(entity) {
        super({
            ...entity,
            defaultName: entity.defaultName || entity.name
        }, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'name', 'defaultName', 'userId', 'color'])
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
        return this.entity.name || this.entity.defaultName || '';
    }

    getUserId() {
        return parseInt(this.entity.userId);
    }

    isCustom() {
        return this.getUserId() > 0;
    }

    getColor() {
        return this.entity.color;
    }
}

class GroupNullObject extends Nullable(Group) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            name: 'n/a',
            defaultName: '',
            userId: 0,
            color: ''
        });
    }
}

export default Group;
export {Group, GroupNullObject};
