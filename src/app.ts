import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./App/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import "./App/config/passport"
import notFound from './App/middlewares/notFound';
import { globalErrorHandler } from './App/middlewares/globalErrorHandler';


const app = express();

app.use(expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());
app.use(cors())

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome to the Tour Management System API"
    })
});

app.use(globalErrorHandler);

app.use(notFound);


export default app;