import { PERMISSIONS, Permissions } from "../permissions";
import { ObjectId, isObjectId, toObjectId } from "../utils";
import Role from "./role";
import TemplateObject, { NonTemplateObjectFunctions } from "./templateObject";

export default class User extends TemplateObject {

    public username?: string;
    public email?: string;
    public avatar?: string;
    public auth?: {
        permissions: Array<Permissions>;
        roles: Array<ObjectId | Role>;
        sources: {
            google?: Date;
            discord?: Date;
        };
    };

    constructor(obj: NonTemplateObjectFunctions<User>) {
        super(obj);

        this.username = obj.username;
        this.email = obj.email;
        this.avatar = obj.avatar;

        // Auth
        if (obj.auth)
            this.auth = {
                permissions: obj.auth.permissions || [],
                roles: (obj.auth.roles || []).map((role) => isObjectId(role as ObjectId) ? toObjectId(role as ObjectId) : new Role(role as Role)),
                sources: {
                    google: obj.auth.sources.google,
                    discord: obj.auth.sources.discord
                }
            };

        this._validation();
    }

    protected _validation(): void {
        if (this.username && typeof this.username !== "string")
            throw "Invalid username";
        if (this.email && (typeof this.email !== "string" || !RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(this.email)))
            throw "Invalid email";
        if (this.avatar && (typeof this.avatar !== "string" || !this.avatar.startsWith("https://")))
            throw "Invalid avatar";

        // Auth
        if (this.auth) {
            if (!Array.isArray(this.auth.permissions))
                throw "Invalid permissions";
            this.auth.permissions.forEach((permission) => {
                if (!PERMISSIONS.includes(permission))
                    throw "Invalid permission";
            });
            if (!Array.isArray(this.auth.roles))
                throw "Invalid roles";
            this.auth.roles.forEach((role) => {
                if (!isObjectId(role as ObjectId) && !(role instanceof Role))
                    throw "Invalid role";
            });

            const now = Date.now();
            if (this.auth.sources.google && (!(this.auth.sources.google instanceof Date) || this.auth.sources.google.getTime() > now))
                throw new Error("Invalid google authentification");
            if (this.auth.sources.discord && (!(this.auth.sources.discord instanceof Date) || this.auth.sources.discord.getTime() > now))
                throw new Error("Invalid discord authentification");
        }
    }
}