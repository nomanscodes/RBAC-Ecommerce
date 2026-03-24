/**
 * Central Route Index
 * Import all routes here and export as a single router
 * This keeps app.ts clean and organized
 */

import { Router } from "express";
import authRouter from "./auth";
import productsRouter from "./products";
import testRouter from "./test";
import usersRouter from "./users";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// ============================================
// API Routes Organization
// ============================================

/**
 * Authentication routes (public)
 * /api/auth/*
 */
router.use("/auth", authRouter);

/**
 * Product routes (mixed public/private)
 * /api/products/*
 */
router.use("/products", productsRouter);

/**
 * User management routes (protected)
 * /api/users/*
 */
// router.use("/users", usersRouter);

/**
 * Test routes (protected)
 * /api/test/*
 */
router.use("/test", authMiddleware, testRouter);

/**
 * Health check (public)
 * /api/health
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * API version info (public)
 * /api
 */
router.get("/", (req, res) => {
  res.json({
    message: "E-commerce API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      users: "/api/users",
      health: "/api/health",
    },
  });
});

export default router;
