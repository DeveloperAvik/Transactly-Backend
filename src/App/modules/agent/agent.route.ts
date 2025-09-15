import { Router } from "express";
import { AgentController } from "./agent.controller";

const router = Router();

router.post("/login", AgentController.loginAgent);

router.post("/create", AgentController.createAgent);
router.get("/", AgentController.getAllAgents);
router.get("/:id", AgentController.getAgentById);
router.patch("/:id", AgentController.updateAgent);
router.delete("/:id", AgentController.deleteAgent);

export const AgentRoutes = router;
