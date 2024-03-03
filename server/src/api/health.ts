import { Express } from "express";

import { RouteWhitelister } from "../middlewares/authentification";
import TemplateRoutes from "./templateRoutes";

export default class HealthRoutes extends TemplateRoutes {

    constructor(app: Express, routeWhitelister: RouteWhitelister) {
        super(app);

        this._init();

        // '/' is already whitelisted by default
        routeWhitelister("/health");
    }

    private _init() {
        this._route<void, string>("get", "/", undefined, (_, res) => {
            res.status(200).send("OK");
        });

        this._route<void, void>("get", "/health", undefined, (_, res) => {
            res.sendStatus(200);
        });
    }
}