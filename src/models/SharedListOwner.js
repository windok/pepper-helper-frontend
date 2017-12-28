import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class SharedListOwner extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'email', 'name', 'avatar']),
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getEmail() {
        return this.entity.email;
    }

    getName() {
        return this.entity.name;
    }

    getAvatar() {
        return this.entity.avatar;
    }
}

class SharedListOwnerNullObject extends Nullable(SharedListOwner) {
    constructor() {
        super({
            id: 0,
            email: '',
            name: '',
            avatar: '',
        });
    }
}

export {
    SharedListOwner,
    SharedListOwnerNullObject
};
