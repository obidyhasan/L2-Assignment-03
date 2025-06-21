import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";

let server: Server;
const port = 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0m3jt.mongodb.net/libraryManagement?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB using Mongoose");

    server = app.listen(port, () => {
      console.log(`Library Management app listening on port ${port}`);
    });
  } catch (error) {
    console.error({
      message: "Failed to connect to MongoDB",
      success: false,
      error,
    });
  }
}

main();
