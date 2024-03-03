import { Role, User } from "core";
import { Subject } from "rxjs";

export type ObjectsCollection = "users" | "roles";
type EventAction = "create" | "update" | "delete";
export type EventObjectType = User | Role;

export default class ObjectsEvents {
    private static _listeners: Record<string, Record<ObjectsCollection, {
        create?: Subject<EventObjectType>;
        update?: Record<string, Subject<EventObjectType>>; // The string is the field path
        delete?: Record<string, Subject<void>>;  // The string is the deleted object id
    }>> = {};

    public static emit(collection: ObjectsCollection, action: "create", field: undefined, newDocument: EventObjectType): void;
    public static emit(collection: ObjectsCollection, action: "update", field: string, newDocument: EventObjectType): void;
    public static emit(collection: ObjectsCollection, action: "delete", field: undefined, newDocument?: undefined): void;
    public static emit(collection: ObjectsCollection, action: EventAction, field?: string, newDocument?: EventObjectType) {
        switch (action) {
            case "create":
                if (newDocument)
                    Object.values(this._listeners).forEach((idListeners) =>
                        idListeners[collection]?.create?.next(newDocument)
                    );
                break;
            case "update":
                if (field && newDocument)
                    Object.values(this._listeners).forEach((idListeners) =>
                        idListeners[collection]?.update?.[field]?.next(newDocument)
                    );
                break;
            case "delete":
                if (field)
                    Object.values(this._listeners).forEach((idListeners) =>
                        idListeners[collection]?.delete?.[field]?.next()
                    );
                break;
        }
    }

    public static on(id: string, collection: ObjectsCollection, action: EventAction, field: string, listener: (newDocument?: EventObjectType) => Promise<void>) {
        if (!this._listeners[id])
            // @ts-expect-error ObjectsCollection can be unset
            this._listeners[id] = {};
        if (!this._listeners[id]?.[collection])
            this._listeners[id][collection] = {};

        switch (action) {
            case "create":
                if (!this._listeners[id]?.[collection]?.create)
                    this._listeners[id][collection].create = new Subject();

                return this._listeners[id][collection].create?.subscribe(listener);
            case "update":
                if (!this._listeners[id]?.[collection]?.update)
                    this._listeners[id][collection].update = {};
                if (!this._listeners[id]?.[collection]?.update?.[field])
                    // @ts-expect-error undefined update is already checked above
                    this._listeners[id][collection].update[field] = new Subject();

                return this._listeners[id][collection].update?.[field].subscribe(listener);
            case "delete":
                if (!this._listeners[id]?.[collection]?.delete)
                    this._listeners[id][collection].delete = {};
                if (!this._listeners[id]?.[collection]?.delete?.[field])
                    // @ts-expect-error undefined delete is already checked above
                    this._listeners[id][collection].delete[field] = new Subject();

                return this._listeners[id][collection].delete?.[field].subscribe(() => listener());
        }
    }

    public static off(id: string, collection?: ObjectsCollection, action?: EventAction, field?: string) {
        if (!field && !action && !collection) {
            Object.keys(this._listeners[id] || {}).forEach((idCollection) =>
                this.off(id, idCollection as ObjectsCollection)
            );
            delete this._listeners[id];
        } else if (!field && !action && collection) {
            Object.keys(this._listeners[id]?.[collection] || {}).forEach((collectionAction) =>
                this.off(id, collection, collectionAction as EventAction)
            );
            delete this._listeners[id]?.[collection];
        } else if (!field && action && collection)
            switch (action) {
                case "create":
                    this._listeners[id]?.[collection]?.create?.unsubscribe();
                    delete this._listeners[id]?.[collection]?.create;
                    break;
                case "update":
                    Object.keys(this._listeners[id]?.[collection]?.update || {}).forEach((actionField) => this.off(id, collection, "update", actionField));
                    delete this._listeners[id]?.[collection]?.update;
                    break;
                case "delete":
                    Object.keys(this._listeners[id]?.[collection]?.delete || {}).forEach((actionField) => this.off(id, collection, "update", actionField));
                    delete this._listeners[id]?.[collection]?.delete;
                    break;
            }
        else if (field && action && collection)
            switch (action) {
                case "create":
                    this.off(id, collection, "create");
                    break;
                case "update":
                    this._listeners[id]?.[collection]?.update?.[field]?.unsubscribe();
                    delete this._listeners[id]?.[collection]?.update?.[field];
                    break;
                case "delete":
                    this._listeners[id]?.[collection]?.delete?.[field]?.unsubscribe();
                    delete this._listeners[id]?.[collection]?.delete?.[field];
                    break;
            }
    }
}