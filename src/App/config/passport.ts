import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { isVerified, Role } from "../modules/user/user.interface";

// ---- Local Strategy ----
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email: string, password: string, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: "User does not exist" });
                }

                const isGoogleAuth = user.auths.some((p) => p.provider === "google");
                if (isGoogleAuth && !user.password) {
                    return done(null, false, { message: "You registered with Google. Please login using Google." });
                }

                const isMatch = await bcryptjs.compare(password, user.password as string);
                if (!isMatch) {
                    return done(null, false, { message: "Incorrect password" });
                }

                return done(null, user);
            } catch (err) {
                console.error("LocalStrategy Error:", err);
                return done(err);
            }
        }
    )
);

// ---- Google Strategy ----
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.googleClientId,
            clientSecret: envVars.googleClientSecret,
            callbackURL: envVars.googleCallbackUrl,
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "No email found in Google account" });
                }

                let user = await User.findOne({ email });

                if (!user) {
                    // Create new user if not exists
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value,
                        role: Role.USER,
                        isVerified: isVerified.VERIFIED,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id,
                            },
                        ],
                    });
                } else {
                    // If user exists but no google provider linked
                    const alreadyHasGoogle = user.auths.some((p) => p.provider === "google");
                    if (!alreadyHasGoogle) {
                        user.auths.push({ provider: "google", providerId: profile.id });
                        await user.save();
                    }
                }

                return done(null, user);
            } catch (err) {
                console.error("GoogleStrategy Error:", err);
                return done(err);
            }
        }
    )
);

// ---- Sessions (only if using session-based auth) ----
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error("Deserialize Error:", err);
        done(err);
    }
});

export default passport;
