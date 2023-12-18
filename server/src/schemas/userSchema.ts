import userSchema from "@models/userModel";
import { User } from "core";
import TemplateSchema from "./templateSchema";

export default class UserSchema extends TemplateSchema<User> {
    constructor() {
        super(User, "users", userSchema);
    }

    public async findByEmail(email: string, fields = "auth"): Promise<User | null> {
        const result = await this._model.findOne({ email }, fields);

        return result ? new User(result.toObject()) : null;
    }
}