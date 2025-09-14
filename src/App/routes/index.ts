import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AgentRoutes } from "../modules/agent/agent.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";

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
    {
        path: "/wallet",   // ✅ wallet route
        route: WalletRoutes
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
