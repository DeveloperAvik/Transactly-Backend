import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { seedSuperAdmin } from "./App/utils/seedSuperAdmin";
import { envVars } from "./App/config/env";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(envVars.mongodbUrl);
        console.log("✅ Connected to MongoDB");
    }
};

// Local dev mode
if (!isProd) {
    const PORT = envVars.port || 3000;

    (async () => {
        try {
            await connectDB();
            await seedSuperAdmin(); // Only seed locally
            app.listen(PORT, () => {
                console.log(`🚀 Server is running on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error("❌ Failed to start server:", error);
            process.exit(1);
        }
    })();
}

// Vercel deploy mode
export default async function handler(req: any, res: any) {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("❌ Error during handler execution:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
