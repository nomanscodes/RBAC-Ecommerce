// /**
//  * EXAMPLE: How to use Permission Middleware in Routes
//  * This file demonstrates different ways to protect routes with permissions
//  */

// import { Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";
// import {
//   checkPermission,
//   checkPermissions,
//   checkAnyPermission,
// } from "../middleware/permissionMiddleware";
// import { PERMISSIONS, MODULES, ACTIONS } from "../types/constants";

// const router = Router();

// // ============================================
// // METHOD 1: Using Permission Slug Constants
// // ============================================

// // Only users with "products-create" permission can create products
// router.post(
//   "/products",
//   authMiddleware, // ← First: Check if logged in
//   checkPermission(PERMISSIONS.PRODUCTS_CREATE), // ← Second: Check permission
//   (req, res) => {
//     res.json({ message: "Product created" });
//   },
// );

// // Only users with "products-delete" permission can delete
// router.delete(
//   "/products/:id",
//   authMiddleware,
//   checkPermission(PERMISSIONS.PRODUCTS_DELETE),
//   (req, res) => {
//     res.json({ message: "Product deleted" });
//   },
// );

// // ============================================
// // METHOD 2: Using Module + Action (More Flexible)
// // ============================================

// // Check permission by module and action
// router.put(
//   "/products/:id",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE), // ← Dynamic!
//   (req, res) => {
//     res.json({ message: "Product updated" });
//   },
// );

// // ============================================
// // METHOD 3: Check Multiple Permissions (ALL required)
// // ============================================

// // User must have BOTH permissions
// router.post(
//   "/products/:id/publish",
//   authMiddleware,
//   checkPermissions([
//     [MODULES.PRODUCTS, ACTIONS.UPDATE],
//     [MODULES.PRODUCTS, ACTIONS.CREATE],
//   ]),
//   (req, res) => {
//     res.json({ message: "Product published" });
//   },
// );

// // ============================================
// // METHOD 4: Check ANY Permission (OR logic)
// // ============================================

// // User needs either products-read OR orders-read permission
// router.get(
//   "/dashboard",
//   authMiddleware,
//   checkAnyPermission([
//     [MODULES.PRODUCTS, ACTIONS.READ],
//     [MODULES.ORDERS, ACTIONS.READ],
//   ]),
//   (req, res) => {
//     res.json({ message: "Dashboard data" });
//   },
// );
// //
// // ============================================
// // METHOD 5: Public Routes (No Permission Check)
// // ============================================

// // Anyone (no auth required)
// router.get("/products", (req, res) => {
//   res.json({ message: "Public product list" });
// });

// // Authenticated but no specific permission required
// router.get("/profile", authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

// // ============================================
// // REAL-WORLD EXAMPLES
// // ============================================

// /**
//  * Product Management Routes
//  */
// router.get(
//   "/admin/products",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.READ),
//   (req, res) => {
//     // List all products
//   },
// );

// router.post(
//   "/admin/products",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
//   (req, res) => {
//     // Create product
//   },
// );

// router.put(
//   "/admin/products/:id",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
//   (req, res) => {
//     // Update product
//   },
// );

// router.delete(
//   "/admin/products/:id",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.DELETE),
//   (req, res) => {
//     // Delete product
//   },
// );

// /**
//  * User Management Routes (Admin only)
//  */
// router.get(
//   "/admin/users",
//   authMiddleware,
//   checkPermission(PERMISSIONS.USERS_READ),
//   (req, res) => {
//     // List users
//   },
// );

// router.delete(
//   "/admin/users/:id",
//   authMiddleware,
//   checkPermission(PERMISSIONS.USERS_DELETE),
//   (req, res) => {
//     // Delete user
//   },
// );

// /**
//  * Order Management
//  */
// router.get(
//   "/orders",
//   authMiddleware,
//   checkPermission(MODULES.ORDERS, ACTIONS.READ),
//   (req, res) => {
//     // View orders
//   },
// );

// router.post(
//   "/orders",
//   authMiddleware,
//   checkPermission(MODULES.ORDERS, ACTIONS.CREATE),
//   (req, res) => {
//     // Create order
//   },
// );

// /**
//  * Reports (Multiple permissions example)
//  */
// router.get(
//   "/admin/reports/sales",
//   authMiddleware,
//   checkPermissions([
//     [MODULES.REPORTS, ACTIONS.READ],
//     [MODULES.ORDERS, ACTIONS.READ],
//   ]),
//   (req, res) => {
//     // Generate sales report (needs both permissions)
//   },
// );

// export default router;
