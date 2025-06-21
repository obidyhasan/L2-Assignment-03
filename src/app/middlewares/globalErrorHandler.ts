import { ErrorRequestHandler, NextFunction } from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Unknown error",
        });
      }
    }
  };
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorResponse: any = {
    name: err.name || "Error",
  };

  // Handle Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errorResponse.errors = err.errors;
  }

  // Handle Mongoose CastError
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
    errorResponse = {
      name: err.name,
      message: err.message,
      path: err.path,
      value: err.value,
    };
  }

  // Custom errors
  else if (err?.statusCode && err?.message) {
    statusCode = err.statusCode;
    message = err.message;
    errorResponse = err.error || {
      name: err.name || "Error",
      message: err.message,
    };
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: errorResponse,
  });
};
