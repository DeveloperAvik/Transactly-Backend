import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AgentRoutes } from "../modules/agent/agent.route";  

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/agent", 
        route: AgentRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
