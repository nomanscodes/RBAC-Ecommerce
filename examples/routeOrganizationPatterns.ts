// /**
//  * ROUTE ORGANIZATION PATTERNS
//  * This file demonstrates industry-standard patterns for organizing Express routes
//  */

// import { Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";
// import { checkPermission } from "../middleware/permissionMiddleware";
// import { MODULES, ACTIONS } from "../types/constants";

// // ============================================
// // PATTERN 1: Separate Public/Private Routers
// // ============================================

// const publicRouter = Router();
// const privateRouter = Router();

// // Public routes (no auth)
// publicRouter.get("/products", (req, res) => {
//   res.json({ message: "Browse products" });
// });

// // Apply auth to all private routes
// privateRouter.use(authMiddleware);

// // Private routes (protected)
// privateRouter.post(
//   "/products",
//   checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
//   (req, res) => {
//     res.json({ message: "Create product" });
//   },
// );

// // ============================================
// // PATTERN 2: RESTful API Structure
// // ============================================

// const productsRouter = Router();

// // Standard REST endpoints
// productsRouter.get("/", (req, res) => {}); // List all
// productsRouter.post("/", authMiddleware, (req, res) => {}); // Create
// productsRouter.get("/:id", (req, res) => {}); // Get one
// productsRouter.put("/:id", authMiddleware, (req, res) => {}); // Update (full)
// productsRouter.patch("/:id", authMiddleware, (req, res) => {}); // Update (partial)
// productsRouter.delete("/:id", authMiddleware, (req, res) => {}); // Delete

// // Nested resources
// productsRouter.get("/:id/reviews", (req, res) => {}); // Get product reviews
// productsRouter.post("/:id/reviews", authMiddleware, (req, res) => {}); // Add review

// // ============================================
// // PATTERN 3: Route Grouping by Feature
// // ============================================

// // Admin routes
// const adminRouter = Router();
// adminRouter.use(authMiddleware); // All admin routes need auth

// adminRouter.get("/dashboard", (req, res) => {});
// adminRouter.get(
//   "/users",
//   checkPermission(MODULES.USERS, ACTIONS.READ),
//   (req, res) => {},
// );
// adminRouter.get(
//   "/reports",
//   checkPermission(MODULES.REPORTS, ACTIONS.READ),
//   (req, res) => {},
// );

// // User routes
// const userRouter = Router();
// userRouter.get("/profile", authMiddleware, (req, res) => {});
// userRouter.put("/profile", authMiddleware, (req, res) => {});
// userRouter.get("/orders", authMiddleware, (req, res) => {});

// // ============================================
// // PATTERN 4: Versioned API
// // ============================================

// const v1Router = Router();
// const v2Router = Router();

// // v1 routes
// v1Router.get("/products", (req, res) => {
//   res.json({ version: "v1", data: [] });
// });

// // v2 routes (improved)
// v2Router.get("/products", (req, res) => {
//   res.json({ version: "v2", data: [], meta: {} });
// });

// // In app.ts:
// // app.use('/api/v1', v1Router);
// // app.use('/api/v2', v2Router);

// // ============================================
// // PATTERN 5: Controller-based Routes
// // ============================================

// // controllers/productController.ts
// const productController = {
//   getAll: (req: any, res: any) => res.json({ message: "Get all" }),
//   getById: (req: any, res: any) => res.json({ message: "Get one" }),
//   create: (req: any, res: any) => res.json({ message: "Create" }),
//   update: (req: any, res: any) => res.json({ message: "Update" }),
//   delete: (req: any, res: any) => res.json({ message: "Delete" }),
// };

// const controllerBasedRouter = Router();

// // Clean routes with controller methods
// controllerBasedRouter.get("/products", productController.getAll);
// controllerBasedRouter.get("/products/:id", productController.getById);
// controllerBasedRouter.post(
//   "/products",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
//   productController.create,
// );
// controllerBasedRouter.put(
//   "/products/:id",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
//   productController.update,
// );
// controllerBasedRouter.delete(
//   "/products/:id",
//   authMiddleware,
//   checkPermission(MODULES.PRODUCTS, ACTIONS.DELETE),
//   productController.delete,
// );

// // ============================================
// // PATTERN 6: Middleware Array for Complex Routes
// // ============================================

// const complexRouter = Router();

// const validateProduct = (req: any, res: any, next: any) => {
//   // Validation logic
//   next();
// };

// const checkOwnership = (req: any, res: any, next: any) => {
//   // Check if user owns the resource
//   next();
// };

// // Apply multiple middleware in array
// complexRouter.put(
//   "/products/:id",
//   [
//     authMiddleware,
//     checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
//     checkOwnership,
//     validateProduct,
//   ],
//   (req, res) => {
//     res.json({ message: "Updated with validation" });
//   },
// );

// // ============================================
// // PATTERN 7: Route-specific Middleware
// // ============================================

// const sellerRouter = Router();

// // Apply auth to all seller routes
// sellerRouter.use(authMiddleware);

// // Seller can only manage their own products
// sellerRouter.get("/products", (req, res) => {
//   // Get products where seller_id = req.user.id
//   res.json({ message: "My products", userId: req.user?.id });
// });

// sellerRouter.post(
//   "/products",
//   checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
//   (req, res) => {
//     // Create product with seller_id = req.user.id
//     res.json({ message: "Product created" });
//   },
// );

// // ============================================
// // RECOMMENDED PROJECT STRUCTURE
// // ============================================

// /*
// routes/
//   ├── index.ts          # Main router that imports all routes
//   ├── auth.ts           # Authentication routes
//   ├── users.ts          # User management routes
//   ├── products.ts       # Product routes
//   ├── orders.ts         # Order routes
//   ├── admin/            # Admin routes folder
//   │   ├── index.ts
//   │   ├── users.ts
//   │   ├── products.ts
//   │   └── reports.ts
//   └── seller/           # Seller routes folder
//       ├── index.ts
//       ├── products.ts
//       └── orders.ts

// controllers/
//   ├── authController.ts
//   ├── userController.ts
//   ├── productController.ts
//   └── orderController.ts

// middleware/
//   ├── authMiddleware.ts
//   ├── permissionMiddleware.ts
//   ├── validationMiddleware.ts
//   └── errorHandler.ts
// */

// export {
//   publicRouter,
//   privateRouter,
//   productsRouter,
//   adminRouter,
//   userRouter,
//   v1Router,
//   v2Router,
//   controllerBasedRouter,
//   complexRouter,
//   sellerRouter,
// };
