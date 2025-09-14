import { Agent } from "./agent.model";
import { IAgent } from "./agent.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";

const createAgent = async (payload: Partial<IAgent>) => {
  // hash password
  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const agent = await Agent.create({
    ...payload,
    password: hashedPassword,
  });

  return agent;
};

const loginAgent = async (payload: { email: string; password: string }) => {
  const agent = await Agent.findOne({ email: payload.email });
  if (!agent) throw new Error("Agent not found");

  const isMatch = await bcrypt.compare(payload.password, agent.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: agent._id, role: "agent" },
    envVars.jwtAccessSecret,
    { expiresIn: "7d" }
  );

  return { token, agent };
};

const getAllAgents = async () => {
  return Agent.find();
};

const getAgentById = async (id: string) => {
  return Agent.findById(id);
};

const updateAgent = async (id: string, payload: Partial<IAgent>) => {
  return Agent.findByIdAndUpdate(id, payload, { new: true });
};

const deleteAgent = async (id: string) => {
  return Agent.findByIdAndDelete(id);
};

export const AgentService = {
  createAgent,
  loginAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};
