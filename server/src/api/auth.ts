import { Express, Request, Response } from "express";
import passport, { AuthenticateOptions } from "passport";

import { RouteWhitelister } from "@middlewares/authentification";
import TemplateRoutes from "./templateRoutes";

export default class AuthRoutes extends TemplateRoutes {
    private readonly _defaultLoginAuthenticateOptions: Readonly<AuthenticateOptions> = {
        failureRedirect: "/auth/login/failure",
        successRedirect: this._clientUrl + "/auth/login/success",
        failureMessage: true
    };
    private readonly _defaultRegisterAuthenticateOptions: Readonly<AuthenticateOptions> = {
        failureRedirect: "/auth/register/failure",
        successRedirect: this._clientUrl + "/auth/register/success",
        failureMessage: true
    };

    constructor(app: Express, routeWhitelister: RouteWhitelister) {
        super(app);

        this._init();

        routeWhitelister("/auth/login/failure");
        routeWhitelister("/auth/register/failure");
        routeWhitelister("/auth/google");
        routeWhitelister("/auth/discord");
    }

    private _init() {
        this._route("get", "/auth/login/failure", undefined, (req: Request, res: Response) => {
            res.redirect(
                this._clientUrl +
                    "/auth/login/failure?failure=" +
                    (req.session as unknown as { messages: Array<string> }).messages[0]
            );
        });
        this._route("get", "/auth/register/failure", undefined, (req: Request, res: Response) => {
            res.redirect(
                this._clientUrl +
                    "/auth/register/failure?failure=" +
                    (req.session as unknown as { messages: Array<string> }).messages[0]
            );
        });

        this._route("post", "/auth/logout", undefined, (req, res, next) =>
            req.logout((error) => {
                if (error) {
                    return next(error);
                }
                res.sendStatus(200);
            })
        );

        // Google
        this._route("get", "/auth/google/login", undefined, passport.authenticate("google-login"));
        this._route(
            "get",
            "/auth/google/login/callback",
            undefined,
            passport.authenticate("google-login", this._defaultLoginAuthenticateOptions)
        );
        this._route("get", "/auth/google/register", undefined, passport.authenticate("google-register"));
        this._route(
            "get",
            "/auth/google/register/callback",
            undefined,
            passport.authenticate("google-register", this._defaultRegisterAuthenticateOptions)
        );

        // Discord
        this._route("get", "/auth/discord/login", undefined, passport.authenticate("discord-login"));
        this._route(
            "get",
            "/auth/discord/login/callback",
            undefined,
            passport.authenticate("discord-login", this._defaultLoginAuthenticateOptions)
        );
        this._route("get", "/auth/discord/register", undefined, passport.authenticate("discord-register"));
        this._route(
            "get",
            "/auth/discord/register/callback",
            undefined,
            passport.authenticate("discord-register", this._defaultRegisterAuthenticateOptions)
        );
    }
}
