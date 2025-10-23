import dotenv from "dotenv";
dotenv.config();

interface EnvVars {
  nodeEnv: "development" | "production" | "test";
  port: number;
  mongodbUrl: string;
  bcryptSaltRound: number;
  jwtAccessSecret: string;
  jwtAccessExpires: string;
  jwtRefreshSecret: string;
  jwtRefreshExpires: string;
  superAdminEmail: string;
  superAdminPass: string;
  superAdminPhone: string;
  googleClientSecret: string;
  googleClientId: string;
  googleCallbackUrl: string;
  expressSessionSecret: string;
  frontendUrl: string;

  // ✅ Added for email (OTP sending)
  emailUser: string;
  emailPass: string;
  emailService: string;
}

const loadEnvVars = (): EnvVars => {
  const requiredVars: string[] = [
    "NODE_ENV",
    "PORT",
    "MONGODB_URL",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASS",
    "SUPER_ADMIN_PHONE",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_SERVICE",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`❌ Environment variable ${varName} is not set`);
    }
  });

  return {
    nodeEnv: process.env.NODE_ENV as "development" | "production" | "test",
    port: Number(process.env.PORT),
    mongodbUrl: process.env.MONGODB_URL as string,
    bcryptSaltRound: Number(process.env.BCRYPT_SALT_ROUND),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES as string,
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
    superAdminPass: process.env.SUPER_ADMIN_PASS as string,
    superAdminPhone: process.env.SUPER_ADMIN_PHONE as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
    expressSessionSecret: process.env.EXPRESS_SESSION_SECRET as string,
    frontendUrl: process.env.FRONTEND_URL as string,

    // ✅ Added
    emailUser: process.env.EMAIL_USER as string,
    emailPass: process.env.EMAIL_PASS as string,
    emailService: process.env.EMAIL_SERVICE as string,
  };
};

export const envVars: EnvVars = loadEnvVars();
