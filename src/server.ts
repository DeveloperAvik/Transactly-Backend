import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv"
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

dotenv.config();
const PORT = process.env.PORT || 3000;

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);

        console.log("Connected to MongoDB");

        server = app.listen(PORT, () => {
            console.log(`Server is running ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}


(async () => {
    await startServer()
    await seedSuperAdmin()

})()

// process.on("unhandledRejection", (reason, promise) => {
//     console.log("Unhandled Rejection at:", promise, "reason:", reason);process.on("unhandledRejection", (reason, promise) => {
//     console.log("Unhandled Rejection at:", promise, "reason:", reason);
//     if (server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// });

// process.on("uncaughtException", (error) => {
//     console.log("Uncaught Exception:", error);
//     if (server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// });

// process.on("SIGTERM", () => {
//     console.log("SIGTERM received. Shutting down gracefully.");
//     if (server) {
//         server.close(() => {
//             console.log("Process terminated!");
//         });
//     } else {
//         console.log("No server to close.");
//     }
// });
//     if (server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// });

// process.on("uncaughtException", (error) => {
//     console.log("Uncaught Exception:", error);
//     if (server) {
//         server.close(() => {
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// });

// process.on("SIGTERM", () => {
//     console.log("SIGTERM received. Shutting down gracefully.");
//     if (server) {
//         server.close(() => {
//             console.log("Process terminated!");
//         });
//     } else {
//         console.log("No server to close.");
//     }
// });