import TemplateObject, { NonTemplateObjectFunctions } from './src/interfaces/templateObject';
import User from './src/interfaces/user';
import { ObjectId, isObjectId, toObjectId } from './src/utils';

export {
    // Interfaces
    TemplateObject,
    User,

    // Utils
    isObjectId,
    toObjectId
};

export type {
    // Utils
    NonTemplateObjectFunctions,
    ObjectId
};