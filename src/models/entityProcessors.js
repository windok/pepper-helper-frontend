const entityStructureFilter = (entity, requiredFields) => {
    const filteredEntity = {};

    requiredFields.forEach((requiredField) => {
        if (entity[requiredField] === undefined) {
            throw TypeError('Failed to create object. Field ' + requiredField + ' is undefined in entity.');
        }

        filteredEntity[requiredField] = entity[requiredField];
    });

    return filteredEntity;
};

const allowedValuesValidator = (entity, field, allowedValues) => {
    return allowedValues.indexOf(entity[field]) > -1;
};

export {
    entityStructureFilter,
    allowedValuesValidator
};