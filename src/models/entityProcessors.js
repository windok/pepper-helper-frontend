const entityStructureFilter = (entity, requiredFields) => {
    const filteredEntity = {};

    requiredFields.forEach((requiredField) => {
        if (entity[requiredField] === undefined) {
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

export {
    entityStructureFilter,
    allowedValuesValidator
};