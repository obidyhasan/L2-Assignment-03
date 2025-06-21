import express, { Application, Request, Response } from "express";
import { booksRouters } from "./app/controllers/books.controller";
import { borrowsRouters } from "./app/controllers/borrows.controller";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Middleware
app.use(express.json());

// Routers
app.use("/api/books", booksRouters);
app.use("/api/borrow", borrowsRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library Management");
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
