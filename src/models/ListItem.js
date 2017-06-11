import Entity from './Entity';
import {entityStructureFilter, allowedValuesValidator} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

const STATUS_DRAFT = 'draft';
const STATUS_BOUGHT = 'bought';
const STATUS_SUSPENDED = 'suspended';

const TYPE_GENERAL = 'general';
const TYPE_RECOMMENDED = 'recommended';

class ListItem extends NotNullable(Entity) {

    constructor(entity) {
        // todo add entity processor to wrap dates
        entity.date = typeof entity.date === 'string' ? new Date(entity.date) : entity.date;

        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'status', 'listId', 'productId', 'unitId', 'groupId', 'quantity', 'type', 'date']),
            (entity) => allowedValuesValidator(entity, 'status', [STATUS_DRAFT, STATUS_BOUGHT, STATUS_SUSPENDED]),
            (entity) => allowedValuesValidator(entity, 'type', [TYPE_GENERAL, TYPE_RECOMMENDED]),
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getStatus() {
        return this.entity.status;
    }

    getListId() {
        return this.entity.listId;
    }

    getProductId() {
        return this.entity.productId;
    }

    getUnitId() {
        return this.entity.unitId;
    }

    getGroupId() {
        return this.entity.groupId;
    }

    getQuantity() {
        return this.entity.quantity;
    }

    getType() {
        return this.entity.type;
    }

    getDate() {
        return this.entity.date;
    }
}

class ListItemNullObject extends Nullable(ListItem) {
    constructor() {
        super({
            id: 0,
            status: STATUS_DRAFT,
            listId: 0,
            productId: 0,
            groupId: 0,
            unitId: 0,
            quantity: 0,
            type: TYPE_GENERAL,
            date: ''
        });
    }
}

export default ListItem;
export {
    ListItem,
    ListItemNullObject,
    STATUS_DRAFT,
    STATUS_BOUGHT,
    STATUS_SUSPENDED,
    TYPE_GENERAL,
    TYPE_RECOMMENDED
};
