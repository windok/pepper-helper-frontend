class ItemAction {

    constructor(func, iconType, text, className) {
        this.func = func;
        this.iconType = iconType;
        this.text = text;
        this.className = className;
    }

    getFunction() {
        return this.func;
    }

    getIconType() {
        return this.iconType;
    }

    getText() {
        return this.text;
    }

    getClassName() {
        return this.className;
    }
}

export default ItemAction;
