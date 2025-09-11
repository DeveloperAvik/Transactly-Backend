import dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
    nodeEnv: "development" | "production" | "test";
    port: string;
    mongodbUrl: string;
    BCRYPT_SALT_ROUND: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASS: string;
    JWT_REFREESH_SECRET: string;
    JWT_REFREESH_EXPIRED: string;
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CALLBACK_URL: string,
    EXPRESS_SESSION_SECRET: string,
    FRONTEND_URL: string,
}

const loasEnvVars = (): EnvVars => {

    const requiredVars: string[] = ['NODE_ENV', 'PORT', 'MONGODB_URL', 'BCRYPT_SALT_ROUND', 'JWT_ACCESS_SECRET', 'JWT_ACCESS_EXPIRES', 'JWT_REFREESH_SECRET', 'JWT_REFREESH_EXPIRED', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CALLBACK_URL', 'EXPRESS_SESSION_SECRET', 'FRONTEND_URL'];

    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is not set`);
        }
    });

    return {
        nodeEnv: process.env.NODE_ENV as "development",
        port: process.env.PORT as string,
        mongodbUrl: process.env.MONGODB_URL as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        JWT_REFREESH_SECRET: process.env.JWT_REFREESH_SECRET as string,
        JWT_REFREESH_EXPIRED: process.env.JWT_REFREESH_EXPIRED as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    };
};

export const envVars: EnvVars = loasEnvVars(); 