import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

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

export const UserRoutes = router;
