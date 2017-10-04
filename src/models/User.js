import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

class User extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['email', 'token', 'tokenLifeTime', 'language', 'name', 'defaultProductListId', 'avatar',])
        ]);
    }

    getEmail() {
        return this.entity.email;
    }

    getToken() {
        return this.entity.token;
    }

    getTokenLifeTime() {
        return this.entity.tokenLifeTime;
    }

    getName() {
        return this.entity.name;
    }

    getLanguage() {
        return this.entity.language;
    }

    getDefaultProductListId() {
        return this.entity.defaultProductListId;
    }

    getAvatar() {
        return this.entity.avatar;
    }
}

export default User;
export {User};
