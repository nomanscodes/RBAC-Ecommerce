import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db";
import "./models/index";
import apiRouter from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes - All routes prefixed with /api
app.use("/api", apiRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API Server",
    status: "running",
    endpoints: {
      api: "/api",
      health: "/api/health",
      docs: "/api",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    // Only sync if tables don't exist, don't alter existing tables
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => console.log("Error: " + err));
