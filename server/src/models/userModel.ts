import mongoose from "mongoose";

import { mongooseDeleteEvent, mongoosePostSaveEvent, mongoosePostUpdateEvent } from "@services/events/mongoEvents";
import { PERMISSIONS, User } from "core";

const userSchema = new mongoose.Schema<User>(
    {
        username: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        avatar: { type: String },
        auth: {
            permissions: { type: [String], enum: PERMISSIONS },
            roles: { type: [mongoose.Schema.Types.ObjectId], ref: "roles" },
            sources: {
                google: { type: Date },
                discord: { type: Date }
            }
        }
    },
    {
        toObject: { virtuals: true },
        timestamps: true
    }
);

userSchema.post("save", (newDocument, next) => mongoosePostSaveEvent(User, newDocument, next));
userSchema.post("findOneAndUpdate", function (newDocument, next) {
    mongoosePostUpdateEvent.bind(this)(User, newDocument, next);
});
userSchema.post("deleteOne", mongooseDeleteEvent);

export default userSchema;
