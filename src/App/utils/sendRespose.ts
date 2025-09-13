import { Response } from "express";

interface TMeta {
  total: number;
  page?: number;
  limit?: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, meta, data: responseData } = data;

  const response: any = {
    statusCode,
    success,
    message,
    data: responseData,
  };

  if (meta) response.meta = meta; 

  res.status(statusCode).json(response);
};
