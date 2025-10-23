import { Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuths";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { TwoFactorValidation } from "./auth.validation";

const router = Router();

// ✅ Register
router.post("/register", validateRequest(createUserZodSchema), AuthControllers.registerUser);

// ✅ Login
router.post("/login", AuthControllers.credentialsLogin);

// ✅ 2FA verify and toggle
router.post("/verify-2fa", validateRequest(TwoFactorValidation.verify2faZodSchema), AuthControllers.verifyTwoStepOtp);
router.post("/2fa-toggle", checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN), validateRequest(TwoFactorValidation.toggle2faZodSchema), AuthControllers.toggleTwoStep);

// ✅ Token, logout, reset
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logOut);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);

// ✅ Google Auth
router.get("/google", (req, res) => {
  const redirect = (req.query.redirect as string) || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect,
  })(req, res);
});
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController);

export { router as AuthRoutes };
