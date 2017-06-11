const Nullable = Base => class extends Base {
    isNullObject() {
        return true;
    }
};

const NotNullable = Base => class extends Base {
    isNullObject() {
        return false;
    }
};

export {
    Nullable,
    NotNullable
};