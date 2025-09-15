import { envVars } from "../config/env";
import { IAuthProvider, isVerified, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {

        if (!envVars.superAdminEmail || !envVars.superAdminPass || !envVars.bcryptSaltRound) {
            throw new Error("SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASS or BCRYPT_SALT_ROUND is missing in env");
        }

        const isSuperAdminExist = await User.findOne({ email: envVars.superAdminEmail });
        if (isSuperAdminExist) {
            console.log("Super Admin already exists");
            return;
        }

        console.log("Creating super admin...");

        const hashedPassword = await bcryptjs.hash(
            envVars.superAdminPass.trim(),
            Number(envVars.bcryptSaltRound)
        );

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.superAdminEmail,
        };

        const payload: IUser = {
            name: "superadmin",
            role: Role.SUPERADMIN,
            email: envVars.superAdminEmail,
            phoneNumber: envVars.superAdminPhone,
            password: hashedPassword,
            isVerified: isVerified.VERIFIED,
            auths: [authProvider],
        };

        const superadmin = await User.create(payload);
        console.log("Super admin created successfully ✅");

        return superadmin;
    } catch (error) {
        console.error("Failed to seed super admin:", error);
    }
};
