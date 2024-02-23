import mongoose from "mongoose";

import { mongooseDeleteEvent, mongoosePostSaveEvent, mongoosePostUpdateEvent } from "@services/events/mongoEvents";
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
    timestamps: true
});

userSchema.post("save", (newDocument, next) => mongoosePostSaveEvent(User, newDocument, next));
userSchema.post("findOneAndUpdate", function (newDocument, next) {
    mongoosePostUpdateEvent.bind(this)(User, newDocument, next);
});
userSchema.post("deleteOne", mongooseDeleteEvent);

export default userSchema;