import TemplateObject, { NonTemplateObjectFunctions } from "./templateObject";

export default class User extends TemplateObject {

    public username?: string;
    public email?: string;
    public avatar?: string;
    public auth?: {
        sources: {
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
                sources: {
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
        if (this.auth)
            if (this.auth.sources.discord && (!(this.auth.sources.discord instanceof Date) || this.auth.sources.discord.getTime() > Date.now()))
                throw new Error("Invalid discord authentification");
    }
}