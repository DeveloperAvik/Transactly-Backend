import { Router, Request, Response } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuths"; 

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPERADMIN),
  UserController.getAllUsers
);

// ✅ 🆕 Add endpoint for current user
router.get(
  "/me",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    res.status(200).json({ success: true, data: req.user });
  }
);

// ✅ 🆕 Optional /profile route for frontend compatibility
router.get(
  "/profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  (req: Request, res: Response) => {
    res.status(200).json({ success: true, data: req.user });
  }
);

export const UserRoutes = router;
