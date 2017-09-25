import Entity from './Entity';
import {Nullable, NotNullable} from 'Models/NullableInterface';
import {entityStructureFilter, dateConverter} from './entityProcessors';

class SocketResponse extends NotNullable(Entity) {
    constructor(entityData) {
        super(
            entityData,
            [
                (entity) => entityStructureFilter(entity, ['id', 'actions']),
            ]
        );
    }

    getId() {
        return this.entity.id;
    }

    getAction(id) {
        const actionIds = Object.keys(this.entity.actions);

        for (let i = 0; i < actionIds.length; i++) {
            if (actionIds[i] === id) {
                return this.entity.actions[actionIds[i]];
            }
        }

        throw new Error('Response for action ' + id + ' was not found!')
    }
}

export default SocketResponse;
export {SocketResponse};
