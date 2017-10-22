import Moment from 'moment';

import Entity from './Entity';
import {Nullable, NotNullable} from 'Models/NullableInterface';
import {entityStructureFilter, dateConverter} from './entityProcessors';

class SyncAction extends NotNullable(Entity) {
    constructor(entityData) {
        super(
            {
                ...entityData,
                payload: {...entityData.payload} || {},
                meta: {...entityData.meta} || {},
                date: entityData.date || Moment.utc(),
                successAction: entityData.successAction || '',
                errorAction: entityData.errorAction || ''
            },
            [
                (entity) => entityStructureFilter(entity, ['id', 'name', 'payload', 'meta', 'date', 'successAction', 'errorAction']),
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

    getMeta() {
        return this.entity.meta;
    }

    getSuccessAction() {
        return this.entity.successAction;
    }

    getErrorAction() {
        return this.entity.errorAction;
    }

    getDate() {
        return this.entity.date
    }
}

export default SyncAction;
export {SyncAction};
