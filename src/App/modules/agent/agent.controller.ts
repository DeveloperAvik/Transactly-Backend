import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AgentService } from "./agent.service";
import { catchAsync } from "../../utils/catchAsyncs";
import { sendResponse } from "../../utils/sendRespose";

const createAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user; // ✅ comes from auth middleware
    const result = await AgentService.createAgent(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Agent created successfully",
        data: result,
    });
});

const updateAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { id } = req.params;
    const result = await AgentService.updateAgent(id, req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent updated successfully",
        data: result,
    });
});

const getAllAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AgentService.getAllAgents();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agents retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getAgentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await AgentService.getAgentById(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent retrieved successfully",
        data: result,
    });
});

const deleteAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { id } = req.params;
    const result = await AgentService.deleteAgent(id, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent deleted successfully",
        data: result,
    });
});

export const AgentController = {
    createAgent,
    updateAgent,
    getAllAgents,
    getAgentById,
    deleteAgent,
};
