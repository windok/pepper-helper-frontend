import Moment from 'moment';

const entityStructureFilter = (entity, requiredFields) => {
    const filteredEntity = {};

    requiredFields.forEach((requiredField) => {
        if (!entity.hasOwnProperty(requiredField)) {
            throw TypeError('Failed to create object. Field \'' + requiredField + '\' is required.');
        }

        filteredEntity[requiredField] = entity[requiredField];
    });

    return filteredEntity;
};

const allowedValuesValidator = (entity, field, allowedFieldValues) => {
    if (allowedFieldValues.indexOf(entity[field]) === -1) {
        throw TypeError('Failed to create object. Entity field \'' + field + '\'=\'' + entity[field] + '\' must be one of: ' + allowedFieldValues.join(', '));
    }

    return entity;
};

const fieldConverter = (entity, convertFields, convertFunction) => {
    convertFields.forEach(field => {
        if (entity[field] === undefined) {
            return;
        }

        entity[field] = convertFunction(entity[field], entity);
    });

    return entity;
};

const numberConverter = (entity, numericFields = []) => {
    return fieldConverter(entity, numericFields, fieldValue => parseInt(fieldValue));
};

const dateConverter = (entity, numericFields = []) => {
    return fieldConverter(entity, numericFields, fieldValue => fieldValue instanceof Moment ? fieldValue : Moment.utc(fieldValue));
};

export {
    entityStructureFilter,
    allowedValuesValidator,
    fieldConverter,
    numberConverter,
    dateConverter
};