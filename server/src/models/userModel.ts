import mongoose from "mongoose";

import { User } from "core";

const userSchema = new mongoose.Schema<User>({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    avatar: { type: String },
    auth: {
        sources: {
            discord: { type: Date, select: false }
        }
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

export default userSchema;