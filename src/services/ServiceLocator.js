class ServiceLocatorElement {

    constructor(name, isShared, createMethod) {
        this._name = name;
        this._isShared = isShared;
        this._createMethod = createMethod;
        this._resolvedInstance = null;
    }

    resolve() {
        if (!this._isShared) {
            return this._createMethod();
        }

        if (!this._resolvedInstance) {
            this._resolvedInstance = this._createMethod();
        }

        return this._resolvedInstance;
    }
}

class ServiceLocator {

    constructor() {
        this._services = {};
    }

    setShared(key, createMethod) {
        this._services[key] = new ServiceLocatorElement(key, true, createMethod);
    }

    set(key, createMethod) {
        this._services[key] = new ServiceLocatorElement(key, false, createMethod);
    }

    has(key) {
        return this._services.hasOwnProperty(key);
    }

    get(key) {
        if (!this.has(key)) {
            // todo create custom error
            throw new Error();
        }

        return this._services[key].resolve();
    }
}

export default new ServiceLocator();

