import passport from "passport";
import { Strategy as GoogleStrategy, Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { isVerified, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {

            const isUserExist = await User.findOne({ email });

            if (!isUserExist) {
                return done({ message: "User Doesnot Exist" })
            }

            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")


            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "You have Authenticated through Google Login \n," })
            }

            const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatch) {
                return done(null, false, { message: "Password doesnot match" })

            }

            return done(null, isUserExist)

        } catch (err) {
            console.log(err)
            done(err);
        }
    })
)

passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "No email found" })
            }

            let user = await User.findOne({ email })

            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: isVerified.VERIFIED,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id,
                        }
                    ]
                })
            }

            return done(null, user)

        } catch (error) {
            console.log("Google Strategy Error", error);

            return done(error)
        }
    })
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error)
    }
})