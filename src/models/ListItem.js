import Moment from 'moment';

import Entity from './Entity';
import {entityStructureFilter, allowedValuesValidator, numberConverter, dateConverter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

const STATUS_DRAFT = 'draft';
const STATUS_BOUGHT = 'bought';
const STATUS_DELETED = 'deleted';

const TYPE_GENERAL = 'general';
const TYPE_RECOMMENDED = 'recommendation';

class ListItem extends NotNullable(Entity) {

    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'tmpId', 'status', 'listId', 'productId', 'unitId', 'groupId', 'quantity', 'type', 'date']),
            (entity) => allowedValuesValidator(entity, 'status', [STATUS_DRAFT, STATUS_BOUGHT, STATUS_DELETED]),
            (entity) => allowedValuesValidator(entity, 'type', [TYPE_GENERAL, TYPE_RECOMMENDED]),
            (entity) => numberConverter(entity, ['id', 'quantity']),
            (entity) => dateConverter(entity, ['date']),
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getTmpId() {
        return this.entity.tmpId;
    }

    getIdentifier() {
        return this.getId() || this.getTmpId()
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

    serialize() {
        const serializedData = super.serialize();

        // 2017-06-03 20:55:26
        serializedData.date = this.getDate().format('YYYY-MM-DD HH:mm:ss');

        return serializedData;
    }
}

class ListItemNullObject extends Nullable(ListItem) {
    constructor() {
        super({
            id: 0,
            tmpId: '',
            status: STATUS_DRAFT,
            listId: 0,
            productId: 0,
            groupId: 0,
            unitId: 0,
            quantity: 0,
            type: TYPE_GENERAL,
            date: Moment.utc()
        });
    }
}

class CustomProductListItemTemplate extends NotNullable(ListItem) {
    constructor(tmpId, listId, productId, groupId, unitId, quantity) {
        super({
            id: 0,
            tmpId,
            status: STATUS_DRAFT,
            listId,
            productId,
            groupId,
            unitId,
            quantity,
            type: TYPE_GENERAL,
            date: Moment.utc()
        });
    }

    clone() {
        const template = this.serialize();

        return new this.constructor(template.tmpId, template.listId, template.productId, template.groupId, template.unitId, template.quantity);
    }
}

export default ListItem;
export {
    ListItem,
    ListItemNullObject,
    CustomProductListItemTemplate,
    STATUS_DRAFT,
    STATUS_BOUGHT,
    TYPE_GENERAL,
    TYPE_RECOMMENDED
};
