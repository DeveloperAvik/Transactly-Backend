import { Router, Request, Response } from "express";
import passport from "passport";

import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuths";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { TwoFactorValidation } from "./auth.validation";

const router = Router();

/**
 * 🧾 AUTH ROUTES
 */

// ✅ Register new user
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  AuthControllers.registerUser
);

// ✅ Login (starts 2FA flow if enabled)
router.post("/login", AuthControllers.credentialsLogin);

// ✅ Verify 2FA OTP
router.post(
  "/verify-2fa",
  validateRequest(TwoFactorValidation.verify2faZodSchema),
  AuthControllers.verifyTwoStepOtp
);

// ✅ Enable / Disable 2FA
router.post(
  "/2fa-toggle",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  validateRequest(TwoFactorValidation.toggle2faZodSchema),
  AuthControllers.toggleTwoStep
);

// ✅ Refresh Token
router.post("/refresh-token", AuthControllers.getNewAccessToken);

// ✅ Logout (clear cookies)
router.post("/logout", AuthControllers.logOut);

// ✅ Reset password (protected)
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

// ✅ 🆕 Get current logged-in user
router.get(
  "/me",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    res.status(200).json({ success: true, data: req.user });
  }
);

// ✅ Google OAuth2
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
