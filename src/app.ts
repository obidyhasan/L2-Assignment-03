import express, { Application, Request, Response } from "express";
import { booksRouters } from "./app/controllers/books.controller";
import { borrowsRouters } from "./app/controllers/borrows.controller";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Routers
app.use("/api/books", booksRouters);
app.use("/api/borrow", borrowsRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library Management");
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
