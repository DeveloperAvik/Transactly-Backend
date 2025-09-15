import { Request, Response, Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuths";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

router.post("/logout", AuthControllers.logOut);

router.post(
    "/reset-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
);

router.get("/google", (req: Request, res: Response) => {
    const redirect = (req.query.redirect as string) || "/";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res);
});

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    AuthControllers.googleCallbackController
);

export { router as AuthRoutes };
