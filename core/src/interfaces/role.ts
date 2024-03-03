import { PERMISSIONS, Permissions } from "../permissions";
import TemplateObject, { NonTemplateObjectFunctions } from "./templateObject";

// Permission "-TEST:READ" means that the permission is overriden and denied
// The weight is the role priority, a higher weight will override a lower weight
export default class Role extends TemplateObject {

    public name: string;
    public permissions: Array<Permissions>;
    public weight: number = 0;

    constructor(obj: NonTemplateObjectFunctions<Role>) {
        super(obj);

        this.name = obj.name;
        this.permissions = obj.permissions || [];
        this.weight = obj.weight || 0;

        this._validation();
    }

    protected _validation(): void {
        if (typeof this.name !== "string")
            throw "Invalid name";
        if (!Array.isArray(this.permissions))
            throw "Invalid permissions";
        this.permissions.forEach((permission) => {
            if (!PERMISSIONS.includes(permission))
                throw "Invalid permission";
        });
        if (typeof this.weight !== "number")
            throw "Invalid weight";
    }
}