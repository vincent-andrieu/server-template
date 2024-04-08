import { RouteMethod } from "@api/templateRoutes";
import { NextFunction, Request, Response } from "express";

/**
 * @param route The route to whitelist (all routes starting with this route will be whitelisted)
 * @param methods The methods to whitelist for this route (undefined means all methods)
 */
export type RouteWhitelister = (route: string, methods?: Array<RouteMethod>) => void;

export default class AuthentificationMiddleware {
    private _whitelistRoutes: Array<{
        route: string;
        methods?: Array<RouteMethod>;
    }> = [];

    public whitelistRoute: RouteWhitelister = (route: string, methods?: Array<RouteMethod>) => {
        if (!route.startsWith("/"))
            route = "/" + route;
        this._whitelistRoutes.push({
            route,
            methods
        });
    };

    public handler(request: Request, response: Response, next: NextFunction) {
        if (this._isWhitelisted(request))
            return next();

        this._verification(request, response, next);
    }

    private _verification(request: Request, response: Response, next: NextFunction) {
        if (request.isAuthenticated())
            return next();
        response.sendStatus(401);
    }

    private _isWhitelisted(request: Request): boolean {
        if (request.originalUrl === "/")
            return true;
        return this._whitelistRoutes.some(
            ({ route, methods }) =>
                (!methods || methods?.includes(request.method.toUpperCase() as RouteMethod)) &&
                request.originalUrl.startsWith(route)
        );
    }

}