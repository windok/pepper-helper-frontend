class Entity {
    constructor(entity, processors = []) {
        processors.forEach(processor => entity = processor(entity));

        this.entity = entity;

        Object.freeze(this);
    }

    serialize() {
        return {...this.entity};
    }

    clone() {
        return new this.constructor(this.serialize());
    }
}

export default Entity;