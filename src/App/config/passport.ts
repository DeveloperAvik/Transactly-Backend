import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { isVerified, Role } from "../modules/user/user.interface";

/**
 * ----------------------------
 * 🔑 LOCAL STRATEGY (email + password)
 * ----------------------------
 */
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email }).select("+password");
        console.log("🔍 Login attempt for:", email);

        if (!user) return done(null, false, { message: "User does not exist" });

        const isGoogleAuth = user.auths?.some((p) => p.provider === "google");
        if (isGoogleAuth && !user.password) {
          return done(null, false, { message: "Login using Google instead." });
        }

        if (user.isVerified !== isVerified.VERIFIED) {
          return done(null, false, { message: "Please verify your email." });
        }

        if (["blocked", "inactive"].includes(user.status)) {
          return done(null, false, { message: "Account suspended. Contact support." });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return done(null, false, { message: "Incorrect password" });

        console.log("✅ Login success:", user.email);
        return done(null, user);
      } catch (err) {
        console.error("LocalStrategy Error:", err);
        return done(err as Error);
      }
    }
  )
);

/**
 * ----------------------------
 * 🌐 GOOGLE STRATEGY (OAuth2)
 * ----------------------------
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.googleClientId,
      clientSecret: envVars.googleClientSecret,
      callbackURL: envVars.googleCallbackUrl,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: "Google account missing email" });

        let user = await User.findOne({ email });

        if (!user) {
          console.log("✨ Creating new Google user:", email);
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value || "",
            role: Role.USER,
            isVerified: isVerified.VERIFIED,
            auths: [{ provider: "google", providerId: profile.id }],
          });
        } else if (!user.auths?.some((p) => p.provider === "google")) {
          user.auths = [...(user.auths || []), { provider: "google", providerId: profile.id }];
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy Error:", err);
        return done(err as Error);
      }
    }
  )
);

/**
 * ----------------------------
 * 🧩 SESSION HANDLING
 * ----------------------------
 */
passport.serializeUser((user: any, done) => done(null, user._id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Deserialize Error:", err);
    done(err as Error);
  }
});

export default passport;
