import { Router } from "express";
import { AgentController } from "./agent.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AgentValidation } from "./agent.validation";

const router = Router();

// Create a new agent
router.post(
    "/",
    validateRequest(AgentValidation.createAgentZodSchema),
    AgentController.createAgent
);

// Get all agents
router.get("/", AgentController.getAllAgents);

// Get a single agent by ID
router.get("/:id", AgentController.getAgentById);

// Update an agent by ID
router.put(
    "/:id",
    validateRequest(AgentValidation.updateAgentZodSchema),
    AgentController.updateAgent
);

// Delete an agent by ID
router.delete("/:id", AgentController.deleteAgent);

export const AgentRoutes = router;
