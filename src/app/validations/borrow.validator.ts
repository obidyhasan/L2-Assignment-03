import { z } from "zod";

export const createBorrowSchema = z.object({
  book: z.string().refine((val) => val.length === 24, {
    message: "Invalid book ID",
  }),
  quantity: z.number().min(1),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
