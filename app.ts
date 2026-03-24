import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import "./models/index"; // Import all models and associations
import testRouter from "./routes/test";
import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
app.use("/api/test", authMiddleware, testRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test DB connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    // Sync all models with database (creates tables if they don't exist)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => console.log("Error: " + err));
