import Role from './src/interfaces/role';
import TemplateObject, { NonTemplateObjectFunctions } from './src/interfaces/templateObject';
import User from './src/interfaces/user';
import { PERMISSIONS, Permissions } from "./src/permissions";
import { ObjectId, isObjectId, toObjectId } from './src/utils';

export {
    PERMISSIONS, Role, TemplateObject,
    User, isObjectId,
    toObjectId
};

export type {
    NonTemplateObjectFunctions,
    ObjectId,
    Permissions
};