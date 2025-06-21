import express, { NextFunction, Request, Response } from "express";
import { Borrow } from "../models/borrows.model";
import { validateRequest } from "../middlewares/globalErrorHandler";
import { createBorrowSchema } from "../validations/borrow.validator";

export const borrowsRouters = express.Router();

// Borrow a Book
borrowsRouters.post(
  "/",
  validateRequest(createBorrowSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const data = await Borrow.create(body);

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: "Invalid book ID",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Borrowed Books
borrowsRouters.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Borrow.aggregate([
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $project: {
            _id: 0,
            book: {
              title: "$bookDetails.title",
              isbn: "$bookDetails.isbn",
            },
            totalQuantity: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: data || [],
      });
    } catch (err) {
      next(err);
    }
  }
);
