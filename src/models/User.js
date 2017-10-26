import Entity from './Entity';
import {entityStructureFilter, dateConverter, allowedValuesValidator} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

const UNIT_TYPE_USA = 'usa';
const UNIT_TYPE_INTERNATIONAL = 'international';
const UNIT_TYPE_INTERNATIONAL_RU = 'international-ru';


class User extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['email', 'token', 'tokenLifeTime', 'language', 'name', 'defaultProductListId', 'avatar', 'unitType']),
            (entity) => allowedValuesValidator(entity, 'unitType', [UNIT_TYPE_USA, UNIT_TYPE_INTERNATIONAL, UNIT_TYPE_INTERNATIONAL_RU]),
            (entity) => dateConverter(entity, ['tokenLifeTime']),
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

    getUnitType() {
        return this.entity.unitType;
    }
}

export default User;
export {
    User,
    UNIT_TYPE_USA,
    UNIT_TYPE_INTERNATIONAL,
    UNIT_TYPE_INTERNATIONAL_RU
};
