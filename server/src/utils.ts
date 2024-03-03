import { NonTemplateObjectFunctions, TemplateObject } from "core";

export type ObjectConstructor<T extends TemplateObject> = { new(model: NonTemplateObjectFunctions<T>): T };