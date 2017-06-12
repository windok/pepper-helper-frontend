class Entity {
    constructor(entity, processors = []) {
        this.entity = entity;

        processors.forEach(processor => this.entity = processor(this.entity));

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