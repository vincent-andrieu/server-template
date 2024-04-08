import { ObjectId, isObjectId } from "core";
import {
    AnyKeys,
    AnyObject,
    CallbackWithoutResultAndOptionalError,
    Document,
    Query,
    UpdateQuery,
    mongo
} from "mongoose";
import { ObjectConstructor } from "utils";
import ObjectsEvents, { EventObjectType, ObjectsCollection } from "./objectsEvents";

export function mongoosePostSaveEvent<T extends EventObjectType>(
    ctor: ObjectConstructor<T>,
    newDocument: Document<ObjectId, unknown, T>,
    next: CallbackWithoutResultAndOptionalError
) {
    ObjectsEvents.emit(
        newDocument.collection.collectionName as ObjectsCollection,
        "create",
        undefined,
        new ctor(newDocument.toObject<T>())
    );

    next();
}

export function mongoosePostUpdateEvent<T extends EventObjectType>(
    this: Query<T, T>,
    ctor: ObjectConstructor<T>,
    newDocument: Document<ObjectId, unknown, T>,
    next: CallbackWithoutResultAndOptionalError
) {
    const updateQuery: UpdateQuery<T> = this.getUpdate() as UpdateQuery<T>;

    if (updateQuery.$set) {
        emitObjectEvents(
            this.model.collection.collectionName as ObjectsCollection,
            updateQuery.$set,
            new ctor(newDocument.toObject<T>())
        );
    }

    next();
}

export function mongooseDeleteEvent<T>(
    this: Query<T, T>,
    result: mongo.DeleteResult,
    next: CallbackWithoutResultAndOptionalError
) {
    if (result.deletedCount === 1) {
        const filter = this.getFilter();

        if (isObjectId(filter._id)) {
            ObjectsEvents.emit(
                this.model.collection.collectionName as ObjectsCollection,
                "delete",
                filter._id.toString()
            );
        }
    }

    next();
}

function emitObjectEvents(
    collection: ObjectsCollection,
    obj: AnyKeys<EventObjectType> & AnyObject,
    newDocument: EventObjectType,
    path?: string
): void {
    Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        ObjectsEvents.emit(collection, "update", currentPath, newDocument);
        if (typeof value === "object") {
            emitObjectEvents(collection, value, newDocument, currentPath);
        }
    });
}
