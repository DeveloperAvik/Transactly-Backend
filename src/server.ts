import { Server } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { seedSuperAdmin } from './App/utils/seedSuperAdmin';
import { envVars } from "./App/config/env";

dotenv.config();
const PORT = envVars.port || 3000;

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.mongodbUrl);
        console.log("Connected to MongoDB");

        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
};

(async () => {
    await startServer();
    await seedSuperAdmin();
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully.");
    if (server) {
        server.close(() => console.log("Process terminated!"));
    } else {
        console.log("No server to close.");
    }
});
