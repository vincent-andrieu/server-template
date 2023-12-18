import passport from "passport";

import UserSchema from "@schemas/userSchema";

passport.serializeUser<string>((user: Express.User, done) => {
    done(null, user.id);
});

passport.deserializeUser<string>(async (userId, done) => {
    try {
        const user = await new UserSchema().get(userId);

        done(null, user);
    } catch(error) {
        done(error);
    }
});