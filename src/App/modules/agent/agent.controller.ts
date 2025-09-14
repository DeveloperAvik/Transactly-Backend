import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AgentService } from "./agent.service";
import { catchAsync } from "../../utils/catchAsyncs";
import { sendResponse } from "../../utils/sendRespose";

const createAgent = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.createAgent(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Agent created successfully",
        data: result,
    });
});

const loginAgent = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.loginAgent(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent logged in successfully",
        data: result,
    });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.getAllAgents();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agents retrieved successfully",
        data: result,
    });
});

const getAgentById = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.getAgentById(req.params.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent retrieved successfully",
        data: result,
    });
});

const updateAgent = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.updateAgent(req.params.id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent updated successfully",
        data: result,
    });
});

const deleteAgent = catchAsync(async (req: Request, res: Response) => {
    const result = await AgentService.deleteAgent(req.params.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent deleted successfully",
        data: result,
    });
});

export const AgentController = {
    createAgent,
    loginAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
};
