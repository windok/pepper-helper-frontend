class Entity {
    constructor(entity, processors = []) {
        processors.forEach(processor => processor());

        this.entity = entity;

        Object.freeze(this);
    }
}

export default Entity;