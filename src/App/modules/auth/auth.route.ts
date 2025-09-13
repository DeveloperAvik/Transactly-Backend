import { Request, Response, Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuths";

const router = Router();

// ✅ Login
router.post("/login", AuthControllers.credentialsLogin);

// ✅ Refresh token
router.post("/refresh-token", AuthControllers.getNewAccessToken);

// ✅ Logout
router.post("/logout", AuthControllers.logOut);

// ✅ Reset password (protected route)
router.post(
    "/reset-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
);

// ✅ Google OAuth login
router.get("/google", (req: Request, res: Response) => {
    const redirect = (req.query.redirect as string) || "/";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res);
});

// ✅ Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    AuthControllers.googleCallbackController
);

export { router as AuthRoutes };
