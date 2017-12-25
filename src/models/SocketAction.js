import moment from 'moment';

import Entity from './Entity';
import {entityStructureFilter, dateConverter} from './entityProcessors';

class SocketAction extends Entity {
    constructor(entityData) {
        super(
            {
                ...entityData,
                payload: {...entityData.payload} || {},
                date: entityData.date || moment.utc()
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

export default SocketAction;
export {SocketAction};
