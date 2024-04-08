import { mongooseDeleteEvent, mongoosePostSaveEvent, mongoosePostUpdateEvent } from "@services/events/mongoEvents";
import { EventObjectType } from "@services/events/objectsEvents";
import { PERMISSIONS, Role } from "core";
import mongoose from "mongoose";
import { ObjectConstructor } from "../utils";

const roleSchema = new mongoose.Schema<Role>(
    {
        name: { type: String, required: true },
        permissions: { type: [String], enum: PERMISSIONS, required: true },
        weight: { type: Number, default: 0 }
    },
    {
        toObject: { virtuals: true },
        timestamps: true
    }
);

roleSchema.post("save", (newDocument, next) => mongoosePostSaveEvent(Role, newDocument, next));
roleSchema.post("findOneAndUpdate", function (newDocument, next) {
    mongoosePostUpdateEvent.bind(this)(Role as ObjectConstructor<EventObjectType>, newDocument, next);
});
roleSchema.post("deleteOne", mongooseDeleteEvent);

export default roleSchema;
