import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuths"; 

const router = Router();

// Register User
router.post(
    "/register",
    validateRequest(createUserZodSchema),
    UserController.createUser
);

// Update User (Admin/Superadmin only for now)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPERADMIN),
    validateRequest(updateUserZodSchema),
    UserController.updateUser
);

// Get All Users (restricted)
router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPERADMIN),
    UserController.getAllUsers
);

export const UserRoutes = router;
