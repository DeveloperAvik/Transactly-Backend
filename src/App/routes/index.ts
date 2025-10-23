import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AgentRoutes } from "../modules/agent/agent.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { TransactionRoutes } from "../modules/transactions/transaction.route";
import { OtpRoutes } from "../modules/otp/otp.route";

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
        path: "/wallet",   
        route: WalletRoutes
    }, {
        path: "/transaction",
        route: TransactionRoutes
    },
    { 
        path: "/otp", 
        route: OtpRoutes 
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
