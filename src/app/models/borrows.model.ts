import { model, Schema, Types } from "mongoose";
import { BorrowStaticMethods, IBorrow } from "../interfaces/borrows.interface";
import { Book } from "./books.model";

export const borrowSchema = new Schema<IBorrow, BorrowStaticMethods>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "The quantity must be greater than 0"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Static Method for update book available filed
borrowSchema.static("updateAvailable", async function (bookId: Types.ObjectId) {
  const book = await Book.findById(bookId);
  if (!book) return;

  if (book.copies === 0) {
    book.available = false;
    await book.save();
  }
});

// Middleware for create borrow
borrowSchema.pre("save", async function (next) {
  try {
    const book = await Book.findById(this.book);
    if (!book) {
      const error = new Error("Book not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    if (book.copies < this.quantity) {
      const error = new Error("Not enough copies available");
      (error as any).statusCode = 400;
      return next(error);
    }

    book.copies -= this.quantity;

    if (book.copies < 0) {
      const error = new Error("Copies cannot be negative");
      (error as any).statusCode = 400;
      return next(error);
    }

    await book.save();

    await Borrow.updateAvailable(book._id);

    next();
  } catch (err) {
    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error("An unknown error occurred"));
    }
  }
});

export const Borrow = model<IBorrow, BorrowStaticMethods>(
  "Borrow",
  borrowSchema
);
