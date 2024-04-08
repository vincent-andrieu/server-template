import roleSchema from "@models/roleModel";
import { Role } from "core";
import TemplateSchema from "./templateSchema";

export default class RoleSchema extends TemplateSchema<Role> {
    constructor() {
        super(Role, "roles", roleSchema);
    }
}
