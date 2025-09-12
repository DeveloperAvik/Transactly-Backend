import { envVars } from "../config/env"
import { IAuthProvider, isVerified, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from 'bcryptjs';

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super Admin already exist")
            return;
        }

        console.log("Trying to create super admin \n")


        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASS, Number(envVars.BCRYPT_SALT_ROUND));

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload : IUser = {
            name: "superadmin",
            role: Role.SUPERADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: isVerified.VERIFIED,
            auths: [authProvider]
        }

        const superadmin = await User.create(payload)

        console.log("Super admin created successfully \n")
        return superadmin


    } catch (error) {
        console.log(error)
    }
}