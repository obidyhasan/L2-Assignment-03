import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.model";
import { validateRequest } from "../middlewares/globalErrorHandler";
import { createBookSchema } from "../validations/book.validator";

export const booksRouters = express.Router();

// Create Book
booksRouters.post(
  "/",
  validateRequest(createBookSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const data = await Book.create(body);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get All Books
booksRouters.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filter, sortBy = "createdAt", sort = "asc", limit } = req.query;

      // Filter
      const query: any = {};
      if (filter) {
        query.genre = filter;
      }

      const data = await Book.find(query)
        .sort({
          [sortBy as string]: sort === "desc" ? -1 : 1,
        })
        .limit(parseInt(limit as string));

      res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get Book by Id
booksRouters.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const data = await Book.findById(bookId);

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: "No book with the given ID",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Update Book
booksRouters.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const updateDoc = req.body;

      const data = await Book.findByIdAndUpdate(bookId, updateDoc, {
        new: true,
      });

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: "No book with the given ID",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete Book
booksRouters.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const data = await Book.findByIdAndDelete(bookId);

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: "No book with the given ID",
        });
        return; // Stop execution here
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
