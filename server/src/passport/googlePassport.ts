import { MongooseError } from "mongoose";
import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { env, nextTick } from "process";

import UserSchema from "@schemas/userSchema";
import { User } from "core";

async function loginAuthentification(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) {
    if (!profile._json.email) {
        return done("Google email not found");
    }
    const userSchema = new UserSchema();
    const user = await userSchema.findByEmail(profile._json.email);

    try {
        if (!user) {
            return done(null, undefined, { message: "User not found" });
        }
        if (!user._id) {
            return done(null, undefined, { message: "Invalid user id" });
        }
        if (!user.auth?.sources.google) {
            userSchema.updateById(user._id, {
                auth: {
                    permissions: [],
                    roles: [],
                    sources: {
                        ...user.auth?.sources,
                        google: new Date()
                    }
                }
            });
        }

        done(null, { _id: user._id } as User);
    } catch (error) {
        done(error as Error);
    }
}

async function registerAuthentification(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) {
    if (!profile._json.email) {
        return done("Google email not found");
    }

    try {
        if (!profile._json.email_verified || profile._json.email_verified === "false") {
            return done(null, undefined, { message: "Google account not verified" });
        }
        const user = await new UserSchema().add(
            new User({
                username: profile.displayName,
                email: profile._json.email,
                avatar: profile._json.picture,
                auth: {
                    permissions: [],
                    roles: [],
                    sources: {
                        google: new Date()
                    }
                }
            })
        );

        done(null, { _id: user._id } as User);
    } catch (error) {
        if ((error as MongooseError & { code?: number }).code === 11000) {
            done(null, undefined, { message: "User already exists" });
        }
        done(error as Error);
    }
}

nextTick(() => {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        throw new Error("Invalid google config");
    }

    passport.use(
        "google-login",
        new Strategy(
            {
                clientID: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/login/callback",
                scope: ["email", "profile"]
            },
            loginAuthentification
        )
    );
    passport.use(
        "google-register",
        new Strategy(
            {
                clientID: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/register/callback",
                scope: ["email", "profile"]
            },
            registerAuthentification
        )
    );
});
