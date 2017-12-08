import moment from 'moment';

import Entity from './Entity';
import {entityStructureFilter, dateConverter, allowedValuesValidator} from './entityProcessors';
import {Nullable, NotNullable} from 'Models/NullableInterface';

const UNIT_TYPE_USA = 'usa';
const UNIT_TYPE_INTERNATIONAL = 'international';
const UNIT_TYPE_INTERNATIONAL_RU = 'international-ru';


class User extends NotNullable(Entity) {
    constructor(entity) {
        super(entity, [
            (entity) => entityStructureFilter(entity, ['id', 'email', 'token', 'refreshToken', 'tokenLifeTime', 'language', 'name', 'avatar', 'unitType']),
            (entity) => allowedValuesValidator(entity, 'unitType', [UNIT_TYPE_USA, UNIT_TYPE_INTERNATIONAL, UNIT_TYPE_INTERNATIONAL_RU]),
            (entity) => dateConverter(entity, ['tokenLifeTime']),
        ]);
    }

    getId() {
        return this.entity.id;
    }

    getEmail() {
        return this.entity.email;
    }

    getToken() {
        return this.entity.token;
    }

    isTokenExpired() {
        return moment.utc().isAfter(this.getTokenLifeTime())
    };

    getRefreshToken() {
        return this.entity.refreshToken;
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
