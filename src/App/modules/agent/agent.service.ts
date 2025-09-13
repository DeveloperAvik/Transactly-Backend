import { JwtPayload } from "jsonwebtoken";
import { Agent } from "./agent.model";
import { IAgent } from "./agent.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createAgent = async (payload: IAgent, decodedToken: JwtPayload) => {
    // ✅ Only Admins / Super Admins can create agents
    if (
        decodedToken.role !== "admin" &&
        decodedToken.role !== "super-admin"
    ) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to create an agent");
    }

    const agent = new Agent(payload);
    return await agent.save();
};

const updateAgent = async (id: string, payload: Partial<IAgent>, decodedToken: JwtPayload) => {
    if (
        decodedToken.role !== "admin" &&
        decodedToken.role !== "super-admin"
    ) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update agent info");
    }

    const updatedAgent = await Agent.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!updatedAgent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }

    return updatedAgent;
};

const getAllAgents = async () => {
    const agents = await Agent.find();
    return {
        data: agents,
        meta: { total: agents.length },
    };
};

const getAgentById = async (id: string) => {
    const agent = await Agent.findById(id);
    if (!agent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    return agent;
};

const deleteAgent = async (id: string, decodedToken: JwtPayload) => {
    if (decodedToken.role !== "super-admin") {
        throw new AppError(httpStatus.FORBIDDEN, "Only Super Admin can delete agents");
    }

    const deletedAgent = await Agent.findByIdAndDelete(id);
    if (!deletedAgent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }

    return deletedAgent;
};

export const AgentService = {
    createAgent,
    updateAgent,
    getAllAgents,
    getAgentById,
    deleteAgent,
};
