import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { router } from "./App/routes";
import "./App/config/passport";
import notFound from "./App/middlewares/notFound";
import { globalErrorHandler } from "./App/middlewares/globalErrorHandler";
import { envVars } from "./App/config/env";

const app = express();

app.use(helmet());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

app.use(cors({
    origin: envVars.frontendUrl || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(expressSession({
    secret: process.env.SESSION_SECRET || "YourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: envVars.mongodbUrl || "mongodb://localhost:27017/session" }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the Tour Management System API" });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
