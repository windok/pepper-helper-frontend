import Entity from './Entity';
import {Nullable, NotNullable} from 'Models/NullableInterface';
import {entityStructureFilter, dateConverter} from './entityProcessors';

class SyncAction extends NotNullable(Entity) {
    constructor(entityData) {
        super(
            {
                ...entityData,
                payload: {...entityData.payload} || {},
                date: {...entityData.date} || new Date
            },
            [
                (entity) => entityStructureFilter(entity, ['id', 'name', 'payload', 'date']),
                (entity) => dateConverter(entity, ['date']),
            ]
        );
    }

    getId() {
        return this.entity.id;
    }

    getName() {
        return this.entity.name;
    }

    getPayload() {
        return this.entity.payload;
    }

    getDate() {
        return this.entity.date
    }
}

export default SyncAction;
export {SyncAction};
