import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AnyZodObject, ZodError } from "zod";

// Validation Middleware using Zod
export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Unexpected validation error",
          error: "Unknown validation issue",
        });
      }
    }
  };

// Global Error Handler Middleware
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorResponse: any = {
    name: err?.name || "Error",
  };

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errorResponse.errors = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  // Mongoose Cast Error
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
    errorResponse = {
      name: err.name,
      message: `Invalid ${err.path}: ${err.value}`,
    };
  }

  // Custom Application Error
  else if (err?.statusCode && err?.message) {
    statusCode = err.statusCode;
    message = err.message;
    errorResponse = err.error || {
      name: err.name || "Error",
      message: err.message,
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorResponse,
  });
};
