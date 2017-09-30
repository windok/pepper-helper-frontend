import Entity from './Entity';
import {Nullable, NotNullable} from 'Models/NullableInterface';
import {entityStructureFilter, dateConverter} from './entityProcessors';

class SocketRequest extends NotNullable(Entity) {
    constructor(entityData) {
        super(
            {
                ...entityData,
                date: {...entityData.date} || new Date,
                timeout: entityData.timeout || 2000
            },
            [
                (entity) => entityStructureFilter(entity, ['id', 'actions', 'date', 'timeout']),
                (entity) => dateConverter(entity, ['date']),
            ]
        );
    }

    getId() {
        return this.entity.id;
    }

    getActions() {
        return this.entity.actions;
    }

    getDate() {
        return this.entity.date;
    }

    getTimeout() {
        return this.entity.timeout;
    }

    toJSON() {
        const actions = {};

        this.getActions().forEach(action => {
            actions[action.getId()] = {
                type: action.getName(),
                payload: {
                    ...action.getPayload(),
                }
            }
        });

        return JSON.stringify({
            requestId: this.getId(),
            actions
        });
    }
}

export default SocketRequest;
export {SocketRequest};
