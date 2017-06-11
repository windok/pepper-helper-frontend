import Entity from 'Models/Entity';
import {entityStructureFilter} from 'Models/entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class List extends NotNullable(Entity) {
    constructor(entity) {
        entity.listItems = entity.listItems || [];

        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'name', 'listItems'])
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getName() {
        return this.entity.name;
    }

    setItems(items) {
        return new List({
            id: this.getId(),
            name: this.getName(),
            listItems: [...items]
        });
    }

    pushItem(itemId) {
        return new List({
            id: this.getId(),
            name: this.getName(),
            listItems: [...this.getItems(), itemId]
        });
    }

    getItems() {
        return this.entity.listItems;
    }
}

class ListNullObject extends Nullable(List) {
    constructor() {
        super({id: 0, name: 'n/a'});
    }
}

export default List;
export {List, ListNullObject};
